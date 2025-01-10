import {FastifyError} from 'fastify';

export const CustomError = (data: string | {[key: string]: any}, statusCode: number) => {
    let error: FastifyError & {data: any};

    if (typeof data !== 'string') {
        error = new Error as FastifyError & {data: any};
        error.data = data;
    } else {
        error = new Error(data) as FastifyError & {data: any};
    }

    error.statusCode = statusCode;
    return error;
};
