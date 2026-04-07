import { login, register } from '@/app/routes/auth/auth.service';
import { LoginInput } from '@/db/login-input.model';
import { RegisterInput } from '@/db/register-input.model';
import { NextFunction, Request, Response, Router } from 'express';

const router = Router();

const attachAuthCookie = (response: Response, token: string) => {
    response.cookie('access_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 1000,
        path: '/'
    });
};

router.post(
    '/auth/register',
    async (
        request: Request<unknown, unknown, { user: RegisterInput }>,
        response: Response,
        next: NextFunction
    ) => {
        try {
            const authInfo = await register(request.body.user);
            attachAuthCookie(response, authInfo.token);
            response.status(201).json(authInfo.user);
        } catch (error) {
            next(error);
        }
    }
);

router.post(
    '/auth/login',
    async (
        request: Request<unknown, unknown, { user: Partial<LoginInput> }>,
        response: Response,
        next: NextFunction
    ) => {
        try {
            const authInfo = await login(request.body.user);
            attachAuthCookie(response, authInfo.token);
            response.status(200).json(authInfo.user);
        } catch (error) {
            next(error);
        }
    }
);

export default router;
