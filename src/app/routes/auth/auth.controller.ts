import { NextFunction, Response, Request, Router } from 'express';
import { login, register } from '@/app/routes/auth/auth.service.js';

const router = Router();

router.post(
    '/auth/register',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = await register(req.body.user);
            res.status(201).json(user);
        } catch (error) {
            next(error);
        }
    }
);

router.post(
    '/auth/login',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = await login(req.body.user);
            res.status(200).json(user);
        } catch (error) {
            next(error);
        }
    }
);

export default router;

