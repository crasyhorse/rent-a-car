import type { NextFunction, Request, Response } from 'express';
import HttpException from '@/app/models/HttpException.js';

export const httpExceptionHandler = (
    err: HttpException,
    _req: Request,
    res: Response,
    next: NextFunction
) => {
    if (err instanceof HttpException && err.errorCode) {
        console.log('Hallo');
        res.status(err.errorCode).json(err.message);
    }

    next(err);
};
