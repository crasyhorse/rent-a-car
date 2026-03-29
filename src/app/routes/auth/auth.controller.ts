import { NextFunction, Response, Request, Router } from 'express';
import { login, register } from '@/app/routes/auth/auth.service.js';
import { RegisterInput } from '@/app/routes/auth/register-input.model';
import { LoginInput } from '@/app/routes/auth/login-input.model';

const router = Router();

router.post(
    '/auth/register',
    async (
        req: Request<unknown, unknown, { user: RegisterInput }>,
        res: Response,
        next: NextFunction
    ) => {
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
    async (
        req: Request<unknown, unknown, { user: LoginInput }>,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const user = await login(req.body.user);
            res.status(200).json(user);
        } catch (error) {
            next(error);
        }
    }
);

export default router;
