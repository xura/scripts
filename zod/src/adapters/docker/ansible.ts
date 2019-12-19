import { Docker } from '../../interfaces/docker'
import { AnsiblePlaybook, Options } from 'ansible-playbook-cli-js'
import path from 'path'
import fs from 'fs'
import { inject, autoInjectable } from 'tsyringe'
import { Config } from '../../interfaces/config'
import { success, warn } from '../../core/color'
import { ENV_VARIABLE_NOT_FOUND } from '../config'

export const ANSIBLE_MESSAGES = {
  STAGING_URL_CREATED: (stagingUrl: string) => `A staging container has been deployed at ${stagingUrl}`,
  ATTEMPTING_TO_CREATE_STAGING_URL: (stagingUrl: string) => `Attempting to create a staging URL at ${stagingUrl}...`,
  ATTEMPTING_TO_DESTROY_DEPLOYMENTS: (stagingUrls: string) => `Attempting to destroy containers and SSL certs for the following deployments: ${stagingUrls}...`,
  DEPLOYMENTS_DESTROYED: (stagingUrlsDescriptor: string) => `The following deployments no longer have staging URLs: ${stagingUrlsDescriptor}`,
}

export const ANSIBLE_ERRORS = {
  PRIVATE_KEY_OR_INVENTORY_NOT_FOUND: (privateKey: string, inventory: string) => `Either the Ansible private key or inventory was not found. inventory: ${inventory}, privateKey: ${privateKey}`,
}

export const ansiblePath = path.resolve(path.join(__dirname, '../../core/ansible'))
export const inventoryPath = path.resolve(path.join(ansiblePath, '/xura'))
export const privateKeyPath = path.resolve(path.join(ansiblePath, '/droplet4'))

export const ansiblePlaybookFailureIndicator = 'FAILED!'

export const ansiblePlaybookRecoverableErrors = [
  // within the gitlab-ci/gitlab_runner, createSpaContainers will throw this error
  // upon running the ansible-playbook command for spinning up a SPA container, the given play will fail with this error
  // the container will still spin up and there are no detectable failures other than the playbook response
  // therfore, this is becoming a "recoverable" error
  'Error creating container: 409 Client Error: Conflict',
]

export const certFileExtensions = [
  'dhparam.pem',
  'key',
  'chain.pem',
  'crt',
]

export enum ANSIBLE_COMMANDS {
  CREATE_SPA = 'create-spa',
  DESTROY_MULTIPLE_SPAS = 'destroy-multiple-spas'
}

@autoInjectable()
export default class implements Docker {
  private _project: string = this._config.get('PROJECT')

  private _stagingUrl: string = this._config.get('STAGING_URL')

  private _cdnStagingUrl: string = this._config.get('CDN_STAGING_URL')

  private _stagingCertsDir: string = this._config.get('STAGING_CERTS_DIR')

  private _playbook = new AnsiblePlaybook(new Options(ansiblePath));

  private _fileExists = (file: string): Promise<boolean> =>
    new Promise(resolve => fs.stat(file, err => err === null ? resolve(true) : resolve(false)))

  private _privateKey = async () =>
    await this._fileExists(privateKeyPath) ? privateKeyPath : this._config.get('ANSIBLE_PRIVATE_KEY')

  private _inventory = async () =>
    await this._fileExists(inventoryPath) ? inventoryPath : this._config.get('ANSIBLE_INVENTORY')

  private _removePeriods = (name: string) => `${name.replace(/\./g, '')}`

  private _spaContainerName = (name: string) =>
    `${this._removePeriods(name)}.${this._project}.${this._stagingUrl}`

  private _spaHtDocs = (name: string) =>
    `${this._config.get('STAGING_HTDOCS')}/${this._project}/${name}`

  private _containsRecoverableError = (playbookResponse: [boolean, { raw: string }]) =>
    ansiblePlaybookRecoverableErrors.some(error => playbookResponse[1]?.raw.includes(error))

  private async _executePlaybook(tag: string, extraVars: Record<string, any>): Promise<[boolean, string]> {
    const privateKey = await this._privateKey()
    const inventory = await this._inventory()

    if (privateKey === ENV_VARIABLE_NOT_FOUND || inventory === ENV_VARIABLE_NOT_FOUND)
      return Promise.reject([false, ANSIBLE_ERRORS.PRIVATE_KEY_OR_INVENTORY_NOT_FOUND(privateKey, inventory)])

    const ansibleExtraVars = JSON.stringify({
      ansible_ssh_private_key_file: privateKey,
      ...extraVars,
    })
    const command = `staging.yml -i ${inventory} --extra-vars '${ansibleExtraVars}' --tags ${tag}`
    const playbookResponse = await this._runAnsibleCommand(command)

    if (!playbookResponse[0])
      return Promise.reject(playbookResponse[1])

    const playbookCommandSucceeded =
      !(playbookResponse[1]?.raw.includes(ansiblePlaybookFailureIndicator)) ||
      this._containsRecoverableError(playbookResponse)

    console.log(playbookResponse[1])
    return Promise.resolve([playbookCommandSucceeded, playbookResponse[1]?.raw])
  }

  private _runAnsibleCommand: (command: string) => Promise<[boolean, { raw: string }]> =
    async command => {
      try {
        const response =
          await this._playbook.command(command).catch(error => {
            if (this._containsRecoverableError([false, { raw: error }]))
              return { raw: error }

            throw new Error(error)
          })

        return Promise.resolve([true, response])
      } catch (error) {
        return Promise.reject([false, error])
      }
    }

  constructor(@inject('Config') private _config: Config = {} as Config) { }

  async createSpaContainer(name: string): Promise<[boolean, string]> {
    const stagingUrl = this._spaContainerName(name)
    const stagingHtdocs = this._spaHtDocs(name)
    const indexHtmlCdnUrl = `${this._cdnStagingUrl}/${this._project}/${name}/index.html`

    console.log(warn(ANSIBLE_MESSAGES.ATTEMPTING_TO_CREATE_STAGING_URL(stagingUrl)))

    const playbookResponse = await this._executePlaybook(ANSIBLE_COMMANDS.CREATE_SPA, {
      containerName: stagingUrl,
      stagingHtdocs,
      indexHtmlCdnUrl,
      network: this._config.get('STAGING_DOCKER_NETWORK'),
    })

    if (!playbookResponse[0]) {
      return Promise.reject([false, playbookResponse[1]])
    }

    console.log(success(ANSIBLE_MESSAGES.STAGING_URL_CREATED(stagingUrl)))

    return Promise.resolve([true, stagingUrl])
  }

  async destroySpaContainers(names: string[]): Promise<[boolean, string]> {
    const stagingUrls = names.map(name => this._spaContainerName(name))
    const stagingHtdocs = names.map(name => this._spaHtDocs(name))
    // TODO write tests around new flatMap implementaiton to certsFilesAndFolders
    const certsFilesAndFolders =
      names.flatMap(name =>
        certFileExtensions.map(extension => `${this._stagingCertsDir}/${this._spaContainerName(name)}.${extension}`))
    const stagingUrlsDescriptor = stagingUrls.join(', ')
    const certDirs =
      names.map(name => `${this._stagingCertsDir}/${this._spaContainerName(name)}`)

    console.log(warn(ANSIBLE_MESSAGES.ATTEMPTING_TO_DESTROY_DEPLOYMENTS(stagingUrlsDescriptor)))

    const playbookResponse = await this._executePlaybook(ANSIBLE_COMMANDS.DESTROY_MULTIPLE_SPAS, {
      containerNames: stagingUrls,
      stagingHtdocs,
      certsFilesAndFolders: [...certDirs, ...certsFilesAndFolders],
    })

    if (!playbookResponse[0]) {
      return Promise.reject([false, playbookResponse[1]])
    }

    return Promise.resolve([true, ANSIBLE_MESSAGES.DEPLOYMENTS_DESTROYED(names.join(', '))])
  }
}
