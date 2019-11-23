import { Command, flags } from '@oclif/command'
import Deploy from '../../services/deploy';
import { success, error } from '../../core/color';

export default class Clean extends Command {

    static description = 'remove all but stickied and the most recent 3 (or provided) deployments'

    static examples = [
        `$ zod deploy:clean --env=staging `
    ]

    static flags = {
        help: flags.help({ char: 'h', description: 'how do I clean the phantom zone!' }),
    }

    static args = [{
        name: 'env',
        required: true,
        description: 'environment to clean up'
    },
    {
        name: 'keep',
        default: '3',
        description: 'keep this many deployments sorted by deployment date (last modified)'
    }]

    async run() {
        const { args } = this.parse(Clean);
        await new Deploy()
            .clean(args.keep)
            .then(response => this.log(success(response[1])))
            .catch(err => this.log(error(err[1])));
    }
}
