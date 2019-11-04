import CdnDeploy from '../services/deploy/cdn';
import {GluegunCommand} from "gluegun";

const deploy: GluegunCommand = {
    name: 'deploy',
    alias: 'd',
    run: async toolbox => {
        const cdn = new CdnDeploy();
        const { print } = toolbox;

        cdn.upload({} as File).then(response => {
            print.info(response[1]);
        });
    },
};

module.exports = deploy;
