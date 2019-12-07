import 'reflect-metadata'
import { Command, flags } from '@oclif/command'
import Deploy from '../../services/deploy'
import { error as err, blue } from '../../core/color'
import terminalLink from 'terminal-link';

export default class Create extends Command {
    static description = 'create a deployment named after the given tag'

    static examples = [
        '$ zod deploy:create v0.0.24',
    ]

    static flags = {
        help: flags.help({ char: 'h', description: 'how do I deploy a Kryptonian container' }),
    }

    static args = [{
        name: 'tag',
        required: true,
        description: 'tag to use to name the container and connect it to a subdomain',
    }]

    async run() {
        const { args } = this.parse(Create)
        const deployer = new Deploy();

        await deployer
            .create(args.tag)
            .then(([success, url]) => deployer.ping(url))
            .then(([success, url]) => this.log(blue(terminalLink(args.tag, url))))
            .catch(error => this.log(err(error[1] ? error[1] : error.toString())))
    }
}

