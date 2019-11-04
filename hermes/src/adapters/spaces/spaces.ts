import ICdnDeploy from "../../interfaces/deploy/cdn";

export default class implements ICdnDeploy {
    upload(file: File): Promise<[boolean, string]> {
        return Promise.resolve([true, 'Spaces deploy implementation']);
    }
}