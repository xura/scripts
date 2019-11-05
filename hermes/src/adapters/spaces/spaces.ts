import * as fs from 'fs';
import * as UploadStream from 's3-stream-upload';
import ICdnDeploy from "../../interfaces/deploy/cdn";
import {S3} from 'aws-sdk';
import {DIGITAL_OCEAN_ACCESS_KEY_ID, DIGITAL_OCEAN_SECRET_ACCESS_KEY} from '../../config';


export default class implements ICdnDeploy {

    private _s3 = new S3({
        accessKeyId: DIGITAL_OCEAN_ACCESS_KEY_ID,
        secretAccessKey: DIGITAL_OCEAN_SECRET_ACCESS_KEY,
        endpoint: 'https://sfo2.digitaloceanspaces.com',
        region: 'sfo2'
    });

    upload(file: File): Promise<[boolean, string]> {
        return new Promise((resolve, reject) => {
            fs.createReadStream(__dirname + '/test-file.text')
                .pipe(UploadStream(this._s3, {
                    Bucket: 'xura-cdn',
                    Key: 'test-file.text',
                    ACL: 'public-read', // private or public-read
                    ContentType: 'image/jpg', // set here, but could be automatic
                }))
                .on('error', reject)
                .on('finish', resolve);
        });
    }
}