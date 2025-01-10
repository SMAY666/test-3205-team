import {Sequelize} from 'sequelize';
import { ENV } from '../constants/env';


export const mysql = new Sequelize({
    host: ENV.DB_HOST,
    port: ENV.DB_PORT,
    username: ENV.DB_USER,
    password: ENV.DB_PASSWORD,
    database: ENV.DB_NAME,
    dialect: 'mysql',
    define: {
        charset: 'utf8',
        collate: 'utf8_general_ci'
    },
    sync: {alter: true, force: false},
})
