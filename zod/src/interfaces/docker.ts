export interface Docker {
    createSpaContainer(name: string): Promise<[boolean, string]>;
}