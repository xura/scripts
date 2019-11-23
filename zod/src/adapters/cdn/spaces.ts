import { ICdn } from '../../interfaces/cdn';
import { autoInjectable } from 'tsyringe';
import { S3 } from 'aws-sdk';

@autoInjectable()
export default class implements ICdn {

    private _s3 = new S3({
        accessKeyId: process.env.DIGITAL_OCEAN_ACCESS_KEY_ID,
        secretAccessKey: process.env.DIGITAL_OCEAN_SECRET_ACCESS_KEY,
        endpoint: process.env.DIGITAL_OCEAN_ENDPOINT,
        region: process.env.DIGITAL_OCEAN_REGION,
        params: {
            ACL: 'public-read',
        }
    });
    private _bucketName = process.env.DIGITAL_OCEAN_BUCKET_NAME || '';

    async clean(keep: number): Promise<[boolean, string]> {
        return new Promise((resolve, reject) => {

            this._s3.listObjects({
                Bucket: this._bucketName,
                Prefix: 'staging/'
            }, (err, data) => {
                if (err) {
                    return reject([false, 'Error listing bucket files']);
                }

                const deleteObjects = [{ Key: 'staging/data/v0.0.24' }];
                const deleteObjectsDescriptor = deleteObjects.map(object => object.Key).join(', ');

                this._s3.deleteObjects({
                    Bucket: this._bucketName,
                    Delete: {
                        Objects: deleteObjects
                    }
                }, (err: any, data: any) => {
                    if (err) {
                        return reject([false, `Error deleting folders ${deleteObjectsDescriptor}`]);
                    }
                    return resolve([true, `Deleted folders ${deleteObjectsDescriptor}`])
                })
            }).promise();
        });
    }
}