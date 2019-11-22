export interface ICdn {
    upload(): Promise<[boolean, string]>;
}