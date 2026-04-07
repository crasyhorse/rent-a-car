import HttpException from '@/app/models/HttpException';
import { Request } from 'express';

type Params = Record<string, string | undefined>;
type ReqBody = unknown;
type ReqQuery = Record<string, unknown>;

export type AuthRequest<
    TParams extends Params = Params,
    TBody = ReqBody,
    TQuery extends ReqQuery = ReqQuery
> = Request<TParams, unknown, TBody, TQuery> & {
    auth?: { id?: string };
};

export const ensureUserMatchesAuth = <
    TParams extends Params,
    TBody = ReqBody,
    TQuery extends ReqQuery = ReqQuery
>(
    request: AuthRequest<TParams, TBody, TQuery>,
    requestedIdParam: keyof TParams & string = 'id' as keyof TParams & string
): string => {
    const authUserId = request.auth?.id;
    const requestUserId = request.params[requestedIdParam];

    if (!(requestedIdParam in request.params)) {
        throw new HttpException(
            500,
            `Route param '${requestedIdParam}' is missing.`
        );
    }

    if (!requestUserId) {
        throw new HttpException(
            422,
            `Route param '${requestedIdParam}' must not be empty.`
        );
    }

    if (authUserId && requestUserId !== authUserId) {
        throw new HttpException(403, 'Access forbidden.');
    }

    return requestUserId;
};