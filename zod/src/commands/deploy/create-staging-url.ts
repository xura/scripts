import 'reflect-metadata'
import { Command, flags } from '@oclif/command'
import Deploy from '../../services/deploy'
import { success, error as err } from '../../core/color'

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

        await new Deploy()
            .createStagingUrl(args.tag)
            .then(response => this.log(success(response[1])))
            .catch(error => this.log(err(error[1])))
    }
}

