import fastify from 'fastify';
import {ENV} from './constants/env';
import {BaseRoute} from './routes';
import {mysql} from './providers/mysql';

export const server = fastify({
    logger: true,
});

void server.register(BaseRoute, '/');
void mysql.sync();


export function start() {
    return new Promise((resolve, reject) => {
        server.listen({host: ENV.HOST, port: ENV.PORT}, (err, address) => {
            if (err) {
                reject(err);
            } else {
                resolve(address);
            }
        })
    })
}
