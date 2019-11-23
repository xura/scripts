import { ICdn } from '../../interfaces/cdn';
import { autoInjectable } from 'tsyringe';
import { S3 } from 'aws-sdk';
import { deleteRecursive } from 's3-commons';

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
        const objectsToDelete =
            await this._s3.listObjects({
                Bucket: this._bucketName,
                Prefix: 'staging/'
            }).promise();


        const deleteObjects = [{ Key: 'staging/data/v0.0.24' }];
        const deleteObjectsDescriptor =
            deleteObjects
                .map(object => object.Key)
                .join(', ');

        // const count =
        //     await deleteRecursive(
        //         this._s3,
        //         this._bucketName,
        //         deleteObjects[0].Key
        //     );

        if (!0)
            return Promise.reject([false, 'Error deleting deployments']);

        return Promise.resolve([true, `Successfully deleted deployments: ${deleteObjectsDescriptor}`]);
    }
}