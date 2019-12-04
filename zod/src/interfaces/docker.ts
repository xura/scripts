export interface Docker {
    createSpaContainer(name: string): Promise<[boolean, string]>;
    destroySpaContainers(names: string[]): Promise<[boolean, string]>;
}