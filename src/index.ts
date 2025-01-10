import {start} from './server';
import {redisClient} from './providers/redis';

start()
    .then(() => {
        redisClient.connect()
            .catch((err) => console.log('Failed to connect to redis:', err));
    })
    .catch((err) => {console.log(err)});
