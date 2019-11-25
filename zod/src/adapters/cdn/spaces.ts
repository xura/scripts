import { ICdn } from '../../interfaces/cdn';
import { autoInjectable, inject } from 'tsyringe';
import { S3 } from 'aws-sdk';
import { deleteRecursive } from 's3-commons';
import { IConfig, Environment } from '../../interfaces/config';

@autoInjectable()
export default class implements ICdn {
    private _bucketName: string;
    private _project: string;

    constructor(@inject('IConfig') private _config: IConfig) {
        this._bucketName = this._config.get('DIGITAL_OCEAN_BUCKET_NAME');
        this._project = this._config.get('PROJECT');
    }

    private _s3 = new S3({
        accessKeyId: this._config.get('DIGITAL_OCEAN_ACCESS_KEY_ID'),
        secretAccessKey: this._config.get('DIGITAL_OCEAN_SECRET_ACCESS_KEY'),
        endpoint: this._config.get('DIGITAL_OCEAN_ENDPOINT'),
        region: this._config.get('DIGITAL_OCEAN_REGION'),
        params: {
            ACL: 'public-read',
        }
    });

    private _deploymentTag = (releasePath: string): string =>
        (releasePath.match(/(v)(\d+\.)(\d+\.)(\d+)/g) || [])[0] || ''

    private _sortMapByDatePropertyValue = (map: Map<string, Date>) =>
        new Map([...map.entries()].sort((a, b) => a[1].getTime() - b[1].getTime()));

    async clean(keep: number, env: Environment): Promise<[boolean, string]> {
        const releasePath = `${env}/${this._project}/`;

        const allObjectsUnderReleasePath =
            ((await this._s3.listObjects({
                Bucket: this._bucketName,
                Prefix: releasePath
            }).promise()).Contents || []);

        const currentDeploymentsOnEnvironment =
            allObjectsUnderReleasePath
                .reduce((acc: Map<string, Date>, object) => {
                    if (!object.Key || !object.LastModified)
                        return acc;

                    const deploymentTag = this._deploymentTag(object.Key);
                    if (!!deploymentTag)
                        return acc.set(deploymentTag, object.LastModified);

                    return acc;
                }, new Map());

        const totalDeployments = currentDeploymentsOnEnvironment.size;

        if (totalDeployments <= keep)
            return Promise.reject([false, `You want to keep ${keep} deployments. There are ${totalDeployments} deployments remaining. Zod will not send any deployments to the phantom zone.`])


        const sortedDeployments = this._sortMapByDatePropertyValue(
            currentDeploymentsOnEnvironment
        );

        const deploymentsToDelete =
            [...sortedDeployments.entries()]
                .slice(0, sortedDeployments.size - keep)
                .map(deployment => `${releasePath}${deployment[0]}`);

        const deleteObjectsDescriptor =
            deploymentsToDelete
                .map(deployment => deployment)
                .join(', ');

        const deletedCount = await deploymentsToDelete
            .reduce(async (acc, deploymentPath) => {
                const accumulator = await acc;
                const totalDeletedForReleasePath = await deleteRecursive(
                    this._s3,
                    this._bucketName,
                    deploymentPath
                );
                return Promise.resolve(accumulator + totalDeletedForReleasePath)
            }, Promise.resolve(0));

        if (!deletedCount)
            return Promise.reject([false, 'Error deleting deployments']);

        return Promise.resolve([true, `Successfully sent these deployments to the phantom zone: ${deleteObjectsDescriptor}`]);
    }
}