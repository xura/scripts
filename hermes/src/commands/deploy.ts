import CdnDeploy from '../services/deploy/cdn';
import validator from '../validation/validator';
import { Toolbox } from "gluegun/build/types/domain/toolbox";
import { GluegunCommand } from "gluegun";

export const enum VALIDATOR {
    string = 0,
    required = 1
}

export type TCommandValidators = { [key: string]: [string, VALIDATOR[]][] }

const deployCommandValidators: TCommandValidators =
{
    arguments: [
        [
            'filePath',
            [
                VALIDATOR.string,
                VALIDATOR.required
            ]
        ]
    ]
};

const deploy: GluegunCommand = {
    name: 'deploy',
    alias: 'd',
    run: toolbox => validator(
        deployCommandValidators,
        toolbox
    )((toolbox: Toolbox) => {
        const { print } = toolbox;
        const { filePath, fileName } = toolbox.parameters.options;

        new CdnDeploy()
            .upload(filePath, fileName)
            .then(response => print.info(response[1]))
            .catch(error => print.error(error));
    })
};

module.exports = deploy;
