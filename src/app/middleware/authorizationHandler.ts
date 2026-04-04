import { expressjwt as jwt } from 'express-jwt';
import type { Request } from 'express-jwt';
import type { GetVerificationKey, TokenGetter } from 'express-jwt';
import type { Secret, Algorithm } from 'jsonwebtoken';

interface JwtOptions {
    secret: Secret | GetVerificationKey;
    getToken: TokenGetter | undefined;
    algorithms: Algorithm[];
    credentialsRequired?: false;
}

const extractAuthTokenFromRequest: TokenGetter = (
    request: Request
): string | Promise<string> | undefined => {
    const cookies = request.headers?.cookie;

    if (!cookies) {
        return undefined;
    }

    const authCookie = cookies
        .split(';')
        .map((cookie) => cookie.trim())
        .find((cookie) => cookie.startsWith('access_token='));

    if (!authCookie) {
        return undefined;
    }

    return decodeURIComponent(authCookie.split('=')[1]);
};

const jwtOptions: JwtOptions = {
    secret: process.env.JWT_SECRET as Secret,
    getToken: extractAuthTokenFromRequest,
    algorithms: ['HS384']
};

const authHandler = {
    optional: jwt({ ...jwtOptions, credentialsRequired: false }),
    required: jwt(jwtOptions)
};

export default authHandler;
