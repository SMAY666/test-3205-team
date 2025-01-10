import {mysql} from '../../../providers/mysql';
import {LinkInstance} from './types';
import {DataTypes} from 'sequelize';


export const LinkModel = mysql.define<LinkInstance>('links', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    originalUrl: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    shortUrl: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },
}, {
    createdAt: true,
    updatedAt: false,
});
