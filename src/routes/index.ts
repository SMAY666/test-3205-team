import {FastifyPluginCallback, FastifyRequest} from 'fastify';
import {linksRepository} from '../modules/links/repository';
import {LinkCreationAttributes} from '../modules/links/model/types';
import {redisClient} from '../providers/redis';

export const BaseRoute: FastifyPluginCallback = (instance, opts, done) => {
    instance.post(
        '/shorten',
        {
            schema: {
                body: {
                    type: 'object',
                    required: ['originalUrl'],
                    properties: {
                        originalUrl: {
                            type: 'string',
                            minLength: 1,
                        },
                        alias: {
                            type: 'string',
                            minLength: 1,
                            maxLength: 20,
                        },
                        lifeTime: {
                            type: 'number',
                        },
                    },
                },
            },
        },
        async (req: FastifyRequest<{Body: Omit<LinkCreationAttributes, 'shortUrl'>}>, reply) => {
            const newLink = await linksRepository.create(req.body);
            reply.status(201).send(newLink);
        },
    );

    instance.get(
        '/:shortUrl',
        {
            schema: {
                params: {
                    type: 'object',
                    required: ['shortUrl'],
                    properties: {
                        shortUrl: {
                            type: 'string',
                            minLength: 1
                        },
                    },
                },
            },
        },
        async (req: FastifyRequest<{Params: {shortUrl: string}}>, reply) => {
            const originalUrl = await linksRepository.getOriginalUrlByShortUrl(req.params.shortUrl);

            const clickCount = await redisClient.get(req.params.shortUrl);
            await redisClient.set(req.params.shortUrl, clickCount ? +clickCount + 1 : 1);

            reply.redirect(originalUrl);
        },
    );

    instance.get(
        '/info/:shortUrl',
        {
            schema: {
                params: {
                    type: 'object',
                    required: ['shortUrl'],
                    properties: {
                        shortUrl: {
                            type: 'string',
                            minLength: 1,
                        },
                    },
                },
                response: {
                    200: {
                        type: 'object',
                        properties: {
                            originalUrl: {
                                type: 'string',
                            },
                            createdAt: {
                                type: 'string'
                            },
                            clickCount: {
                                type: 'integer',
                            },
                        },
                    },
                },
            },
        },
        async (req: FastifyRequest<{Params: {shortUrl: string}}>, reply) => {
            const info = await linksRepository.get(req.params.shortUrl);
            const clickCount = await redisClient.get(req.params.shortUrl);

            reply.status(200).send({
                originalUrl: info.originalUrl,
                createdAt: info.createdAt,
                clickCount: clickCount,
            });
        }
    )
    instance.delete(
        '/delete/:shortUrl',
        {
            schema: {
                params: {
                    type: 'object',
                    required: ['shortUrl'],
                    properties: {
                        shortUrl: {
                            type: 'string',
                            minLength: 1,
                        },
                    },
                },
            },
        },
        async (req, reply) => {
            const deleted = await linksRepository.delete((req.params as {shortUrl: string}).shortUrl);
            reply.status(200).send(deleted);
        }
    )
    done();
}
