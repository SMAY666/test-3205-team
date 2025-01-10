import {Model} from 'sequelize';

export type LinkAttributes = {
    id: number,
    originalUrl: string,
    shortUrl: string,
    createdAt: Date,
    expiresAt?: Date,
};

export type LinkCreationAttributes = Omit<LinkAttributes, 'id' | 'createdAt'> & {
    lifeTime?: number,
    alias: string,
};
export interface LinkInstance extends Model<LinkAttributes, LinkCreationAttributes>, LinkAttributes {}
