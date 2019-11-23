export interface ICdn {
    clean(keep: number): Promise<[boolean, string]>;
}