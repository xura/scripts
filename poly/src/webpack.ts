import path from 'path';

export const config = (entry: string) => ({
    entry: path.resolve(__dirname, entry)
});