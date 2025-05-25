import type { NextFunction, Request, Response } from 'express';
import HttpException from '@/app/models/HttpException.js';

export const invalidtokenHandler = (
    err: HttpException,
    _req: Request,
    res: Response,
    next: NextFunction
) => {
    if (err.name === 'UnauthorizedError') {
        res.status(401).send('invalid token...');
    } else {
        next(err);
    }
};

