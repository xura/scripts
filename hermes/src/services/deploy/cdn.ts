import {inject, autoInjectable} from "tsyringe";
import ICdnDeploy from "../../interfaces/deploy/cdn";

@autoInjectable()
export default class {
    constructor(@inject('ICdnDeploy') private cdn?: ICdnDeploy) {}

    /**
     * Upload a file to the CDN
     * @param {File} file
     * @return {[boolean, string]} status
     */
    upload = (file: File): Promise<[boolean, string]> => this.cdn.upload(file)
}
