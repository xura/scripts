import {Docker} from '../../interfaces/docker'
import {AnsiblePlaybook, Options} from 'ansible-playbook-cli-js'
import path from 'path'
import fs from 'fs'
import {inject, autoInjectable} from 'tsyringe'
import {Config} from '../../interfaces/config'
import {success, warn} from '../../core/color'

export const ANSIBLE_MESSAGES = {
  STAGING_URL_CREATED: (stagingUrl: string) => `A staging container has been deployed at ${stagingUrl}`,
  ATTEMPTING_TO_CREATE_STAGING_URL: (stagingUrl: string) => `Attempting to create a staging URL at ${stagingUrl}...`,
  ATTEMPTING_TO_DESTROY_DEPLOYMENTS: (stagingUrls: string) => `Attempting to destroy containers and SSL certs for the following deployments: ${stagingUrls}...`,
  DEPLOYMENTS_DESTROYED: (stagingUrlsDescriptor: string) => `The following deployments no longer have staging URLs: ${stagingUrlsDescriptor}`,
}

export const ansibleDir = path.resolve(path.join(__dirname, '../../core/ansible'))
export const inventory = path.resolve(path.join(ansibleDir, '/xura'))
export const privateKey = path.resolve(path.join(ansibleDir, '/droplet4'))

@autoInjectable()
export default class implements Docker {
  private _project: string = this._config.get('PROJECT')

  private _stagingUrl: string = this._config.get('STAGING_URL')

  private _cdnStagingUrl: string = this._config.get('CDN_STAGING_URL')

  private _stagingCertsDir: string = this._config.get('STAGING_CERTS_DIR')

  private _playbook = new AnsiblePlaybook(
    new Options(ansibleDir)
  );

  private _fileExists = (file: string) => new Promise(resolve => {
    fs.stat(file, err => {
      if (err === null) {
        resolve(true)
      } else {
        resolve(false)
      }
    })
  })

  private _privateKey =
    async () => await this._fileExists(privateKey) ? privateKey : this._config.get('ANSIBLE_PRIVATE_KEY')

  private _inventory =
    async () => await this._fileExists(inventory) ? inventory : this._config.get('ANSIBLE_INVENTORY')

  private _removePeriods = (name: string) => `${name.replace(/\./g, '')}`

  private _spaContainerName = (name: string) =>
    `${this._removePeriods(name)}.${this._project}.${this._stagingUrl}`

  private _spaHtDocs = (name: string) =>
    `${this._config.get('STAGING_HTDOCS')}/${this._project}/${name}`

  constructor(@inject('Config') private _config: Config = {} as Config) { }

  async createSpaContainer(name: string): Promise<[boolean, string]> {
    const stagingUrl = this._spaContainerName(name)
    const stagingHtdocs = this._spaHtDocs(name)
    const indexHtmlCdnUrl = `${this._cdnStagingUrl}/${this._project}/${name}/index.html`

    const ansibleExtraVars = JSON.stringify({
      ansible_ssh_private_key_file: await this._privateKey(),
      containerName: stagingUrl,
      stagingHtdocs,
      indexHtmlCdnUrl,
      network: this._config.get('STAGING_DOCKER_NETWORK'),
    })
    const command = `staging.yml -i ${await this._inventory()} --extra-vars '${ansibleExtraVars}' --tags create-spa`

    try {
      console.log(warn(ANSIBLE_MESSAGES.ATTEMPTING_TO_CREATE_STAGING_URL(stagingUrl)))
      await this._playbook.command(command)
    } catch (error) {
      return Promise.reject([false, error])
    }

    console.log(success(ANSIBLE_MESSAGES.STAGING_URL_CREATED(stagingUrl)))

    return Promise.resolve([true, stagingUrl])
  }

  async destroySpaContainers(names: string[]): Promise<[boolean, string]> {
    const stagingUrls = names.map(name => this._spaContainerName(name))
    const stagingHtdocs = names.map(name => this._spaHtDocs(name))
    const certsFilesAndFolders =
      names.map(name => `${this._stagingCertsDir}/${this._removePeriods(name)}.*`)
    const stagingUrlsDescriptor = stagingUrls.join(', ')
    const certDirs =
      names.map(name => `${this._stagingCertsDir}/${this._spaContainerName(name)}`)

    const ansibleExtraVars = JSON.stringify({
      ansible_ssh_private_key_file: await this._privateKey(),
      containerNames: stagingUrls,
      stagingHtdocs,
      certsFilesAndFolders,
      certDirs,
    })
    const command = `staging.yml -i ${await this._inventory()} --extra-vars '${ansibleExtraVars}' --tags destroy-multiple-spas`

    try {
      console.log(warn(ANSIBLE_MESSAGES.ATTEMPTING_TO_DESTROY_DEPLOYMENTS(stagingUrlsDescriptor)))
      await this._playbook.command(command)
    } catch (error) {
      return Promise.reject([false, error])
    }

    return Promise.resolve([true, ANSIBLE_MESSAGES.DEPLOYMENTS_DESTROYED(names.join(', '))])
  }
}
