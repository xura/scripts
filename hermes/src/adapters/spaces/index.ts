import * as fs from 'fs';
import * as UploadStream from 's3-stream-upload';
import ICdnDeploy from "../../interfaces/deploy/cdn";
import { S3 } from 'aws-sdk';
// import {
//     DIGITAL_OCEAN_ACCESS_KEY_ID,
//     DIGITAL_OCEAN_SECRET_ACCESS_KEY,
//     // DIGITAL_OCEAN_BUCKET_NAME,
//     DIGITAL_OCEAN_ENDPOINT,
//     DIGITAL_OCEAN_REGION
// } from '../../config';


export default class implements ICdnDeploy {

    private _s3 = new S3({
        accessKeyId: process.env.DIGITAL_OCEAN_ACCESS_KEY_ID,
        secretAccessKey: process.env.DIGITAL_OCEAN_SECRET_ACCESS_KEY,
        endpoint: process.env.DIGITAL_OCEAN_ENDPOINT,
        region: process.env.DIGITAL_OCEAN_REGION,
        params: {
            ACL: 'public-read',
        }
    });

    upload(filePath: string, filename: string): Promise<[boolean, string]> {
        return new Promise((resolve, reject) => {
            fs.createReadStream(filePath)
                .pipe(UploadStream(this._s3, {
                    Bucket: process.env.DIGITAL_OCEAN_BUCKET_NAME,
                    Key: filename,
                }))
                .on('error', reject)
                .on('finish', resolve);
        });
    }
}