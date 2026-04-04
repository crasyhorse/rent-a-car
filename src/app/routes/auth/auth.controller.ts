import { login, register } from '@/app/routes/auth/auth.service';
import { LoginInput } from '@/app/routes/auth/login-input.model';
import { RegisterInput } from '@/app/routes/auth/register-input.model';
import { NextFunction, Request, Response, Router } from 'express';

const router = Router();
const AUTH_COOKIE_NAME = 'access_token';
const AUTH_TOKEN_MAX_AGE_MS = 60 * 60 * 1000;

const attachAuthCookie = (res: Response, token: string) => {
    res.cookie(AUTH_COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: AUTH_TOKEN_MAX_AGE_MS,
        path: '/'
    });
};

router.post(
    '/auth/register',
    async (
        req: Request<unknown, unknown, { user: RegisterInput }>,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const authInfo = await register(request.body.user);
            attachAuthCookie(response, authInfo.token);
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
            const authInfo = await login(request.body.user);
            attachAuthCookie(response, authInfo.token);
        } catch (error) {
            next(error);
        }
    }
);

export default router;
