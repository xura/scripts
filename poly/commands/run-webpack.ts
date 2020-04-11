import webpack from 'webpack';
import { config } from '../src/webpack';

webpack(config(process.argv[2])).watch({
    aggregateTimeout: 300,
    poll: undefined
}, (err, stats) => {
    if (err) {
        console.log(err.message);
    }
    console.log(stats.toString({ colors: true }));
});