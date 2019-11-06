import CdnDeploy from '../services/deploy/cdn/cdn';
import validator from '../validation/services/validator';
import {Toolbox} from "gluegun/build/types/domain/toolbox";
import {GluegunCommand} from "gluegun";

const deploy: GluegunCommand = {
    name: 'deploy',
    alias: 'd',
    run: validator((toolbox: Toolbox) => {
        const {print} = toolbox;
        const {filePath, fileName} = toolbox.parameters.options;

        new CdnDeploy()
            .upload(filePath, fileName)
            .then(response => print.info(response[1]))
            .catch(error => print.error(error));
    })(),
};

module.exports = deploy;
