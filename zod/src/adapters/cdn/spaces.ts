import { ICdn } from '../../interfaces/cdn';
import { autoInjectable } from 'tsyringe';

@autoInjectable()
export default class implements ICdn {
    upload(): Promise<[boolean, string]> {
        return Promise.resolve([true, 'File uploaded successfully']);
    }
}