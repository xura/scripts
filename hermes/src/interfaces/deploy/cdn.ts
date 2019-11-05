export default interface ICdnDeploy {
    upload(filePath: string, filename: string): Promise<[boolean, string]>
}