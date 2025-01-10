import 'dotenv/config';
import {cleanEnv, num, str} from 'envalid';


export const ENV = cleanEnv(Object.assign({}, process.env), {
    HOST: str(),
    PORT: num(),

    DB_HOST: str(),
    DB_PORT: num(),
    DB_USER: str(),
    DB_PASSWORD: str(),
    DB_NAME: str(),

    REDIS_HOST: str(),
    REDIS_PORT: num(),
})
