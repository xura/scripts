import { Command, flags } from '@oclif/command'
import DeployService from '../services/deploy';


export default class Deploy extends Command {

    static description = 'describe the command here'

    static examples = [
        `$ zod hello
hello world from ./src/hello.ts!
`,
    ]

    static flags = {
        help: flags.help({ char: 'h' }),
        // flag with a value (-n, --name=VALUE)
        name: flags.string({ char: 'n', description: 'name to print' }),
        // flag with no value (-f, --force)
        force: flags.boolean({ char: 'f' }),
    }

    static args = [{ name: 'file' }]

    async run() {
        // const { args, flags } = this.parse(Deploy);
        this.log(`deploy from ./src/commands/hello.ts`)
        await new DeployService()
            .upload()
            .then(response => this.log(response[1]))
            .catch(error => error);

        // const name = flags.name || 'world'
        // this.log(`deploy ${name} from ./src/commands/hello.ts`)
        // if (args.file && flags.force) {
        //     this.log(`you input --force and --file: ${args.file}`)
        // }
    }
}
