import 'reflect-metadata';
export type ConfigKey =
    'DIGITAL_OCEAN_ACCESS_KEY_ID'
    | 'DIGITAL_OCEAN_SECRET_ACCESS_KEY'
    | 'DIGITAL_OCEAN_BUCKET_NAME'
    | 'DIGITAL_OCEAN_ENDPOINT'
    | 'DIGITAL_OCEAN_REGION'
    | 'PROJECT'
    | 'NODE_ENV';

export type Environment = 'staging' | 'production';

export interface Config {
    get(key: ConfigKey): string;
}
