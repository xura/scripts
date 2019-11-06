import { inject, autoInjectable } from "tsyringe";
import ICdnDeploy from "../../interfaces/deploy/cdn";

@autoInjectable()
export default class {
    constructor(
        @inject('ICdnDeploy') private cdn?: ICdnDeploy
    ) { }

    /**
     * Upload a file to the CDN
     * @return {[boolean, string]} status
     * @param {string} filePath
     * @param {string} fileName
     */
    upload = (filePath: string, fileName: string): Promise<[boolean, string]> =>
        this.cdn.upload(filePath, fileName)
}
