import 'reflect-metadata'
import { Command, flags } from '@oclif/command'
import Deploy from '../../services/deploy'
import { success, error as err, blue } from '../../core/color'
import terminalLink from 'terminal-link';

export default class CreateStagingUrl extends Command {
    static description = 'spin up a staging URL for a given tag'

    static examples = [
        '$ zod deploy:create-staging-url v0.0.24',
    ]

    static flags = {
        help: flags.help({ char: 'h', description: 'how do I spin up a staging URL for the phantom zone!' }),
    }

    static args = [{
        name: 'tag',
        required: true,
        description: 'tag to associate to a new staging URL',
    }]

    async run() {
        const { args } = this.parse(CreateStagingUrl)
        const deployer = new Deploy();

        await deployer
            .createStagingUrl(args.tag)
            .then(([success, stagingUrl]) => deployer.ping(stagingUrl))
            .then(([success, stagingUrl]) => this.log(blue(terminalLink(args.tag, stagingUrl))))
            .catch(error => this.log(err(error[1] ? error[1] : error.toString())))
    }
}

