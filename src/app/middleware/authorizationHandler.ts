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
    req: Request
): string | Promise<string> | undefined => {
    let token;

    const authHeader = req.headers?.authorization;
    if (authHeader && ['Token', 'Bearer'].includes(authHeader.split(' ')[0])) {
        token = authHeader.split(' ')[1];
    }

    if (req.query && req.query.token) {
        token = String(req.query.token);
    }

    return token;
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
