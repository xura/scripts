import ICdnDeploy from "../../interfaces/deploy/cdn";
const API_SECRET = process.env.DEVELOPMENT_SECRET || 'DEVELOPMENT - SECRET';


export default class implements ICdnDeploy {
    upload(file: File): Promise<[boolean, string]> {
        return Promise.resolve([true, `Spaces deploy implementation ${API_SECRET}`]);
    }
}