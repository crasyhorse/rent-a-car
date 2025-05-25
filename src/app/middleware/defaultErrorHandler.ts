import type { NextFunction, Request, Response } from 'express';

export const defaultErrorHandler = (
    err: Error,
    _req: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _next: NextFunction
) => {
    console.error(err.stack);
    res.status(500).json(err.message);
};

