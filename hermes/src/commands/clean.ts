import { Toolbox } from "gluegun/build/types/domain/toolbox";
import { GluegunCommand } from "gluegun";

const deploy: GluegunCommand = {
    name: 'clean',
    alias: 'c',
    run: (toolbox: Toolbox) => {
        const { print } = toolbox;
        // const { filePath, fileName } = toolbox.parameters.options;

        // new CdnDeploy()
        //     .upload(filePath, fileName)
        //     .then(response => print.info(`${fileName} uploaded successfully`))
        //     .catch(error => {
        //         if (error) {
        //             print.error(`Error uploading ${fileName}`)
        //         }
        //     });
        print.info(`Clean executed`)
    }
};

module.exports = deploy;
