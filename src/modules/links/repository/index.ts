import type {LinkCreationAttributes, LinkInstance} from '../model/types';
import {LinkModel} from '../model';
import {randomBytes} from 'crypto';
import {CustomError} from '../../../utils/customError';
import {SHORT_URL_LENGTH} from '../../../constants/url';
import {redisClient} from '../../../providers/redis';


class LinksRepository {
    public async get(shortUrl: string): Promise<LinkInstance> {
        const link = await LinkModel.findOne({where: {shortUrl}});
        if (!link) {
            throw CustomError('Link not found', 404);
        }
        if (link.expiresAt && (Date.now() > link.expiresAt.getTime())) {
            throw CustomError('Gone', 410);
        }

        return link;
    }
    public async isUnique(alias: string): Promise<boolean> {
        const shortExist = await LinkModel.findOne({
            where: {shortUrl: alias}
        });
        return !(!!shortExist);
    }

    public async create(data: Omit<LinkCreationAttributes, 'shortUrl'>): Promise<string> {
        let resultShortUrl = undefined
        if (!data.alias) {
            resultShortUrl = await this.generateUniqueLink();
        } else if (!(await this.isUnique(data.alias))) {
            throw CustomError('Alias is not unique', 400);
        }

        const newLink = await LinkModel.create({
            ...data,
            shortUrl: data.alias ?? resultShortUrl,
            ...(data.lifeTime ? {expiresAt: new Date(Date.now() + data.lifeTime)} : {})
        });

        return newLink.shortUrl;
    }

    public async getOriginalUrlByShortUrl(shortUrl: string): Promise<string> {
        const base = await LinkModel.findOne({where: {shortUrl}});
        if (!base) {
            throw CustomError('Link not found', 404);
        }

        if (base.expiresAt && (Date.now() > base.expiresAt.getTime())) {
            throw CustomError('Gone', 410);
        }
        return base.originalUrl;
    }

    public async delete(shortUrl: string): Promise<{success: true}> {
        const link = await LinkModel.findOne({where: {shortUrl}});
        if (!link) {
            throw CustomError('Link not found', 404);
        }
        await link.destroy();

        await redisClient.del(shortUrl);

        return {success: true};
    }

    private async generateUniqueLink(): Promise<string> {
        const bytesCount = 16;
        let short = undefined

        do {
            short = randomBytes(bytesCount).toString('hex').substring(0, SHORT_URL_LENGTH);
        } while (short && !(await this.isUnique(short)));

        return short;
    }
}

export const linksRepository = new LinksRepository();
