export default interface ICdnDeploy {
    upload(file: File): Promise<[boolean, string]>
}