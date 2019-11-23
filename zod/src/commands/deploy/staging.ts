import { Command, flags } from '@oclif/command'
import DeployService from '../../services/deploy';
import { flagUsages } from '@oclif/parser';


export default class Staging extends Command {

    static description = 'Staging'

    static examples = [
        `$`,
    ]

    static flags = {
        help: flags.help({ char: 'h' }),
        // flag with a value (-n, --name=VALUE)
        name: flags.string({ char: 'n', description: 'name to print' }),
        // flag with no value (-f, --force)
        force: flags.boolean({ char: 'f' })
    }

    static args = [{ name: 'file' }, { name: 'env', required: true }]

    async run() {
        throw Error('Not Implemented');
    }
}
