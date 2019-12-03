export interface Ping {
    check(site: string, attempts: number, interval: number): Promise<[boolean, string]>;
}