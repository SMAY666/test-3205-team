import {createClient} from 'redis';
import {ENV} from '../constants/env';

export const redisClient = createClient({
    socket: {
        host: ENV.REDIS_HOST,
        port: ENV.REDIS_PORT,
    }
});

redisClient.on('error', (err) => {console.log('Redis error: ', err)});
