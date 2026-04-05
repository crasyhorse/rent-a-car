import authHandler from '@/app/middleware/authorizationHandler';
import {
    createProfile,
    getProfile,
    updateProfile
} from '@/app/routes/userprofile/userProfile.service';
import type { UserProfile, UserProfilePatch } from '@/db/user-profile.model';
import { NextFunction, Request, Response, Router } from 'express';

const router = Router();

type AuthRequest = Request & { auth?: { id?: string } };

const ensureUserMatchesAuth = (
    request: AuthRequest,
    response: Response
): string | undefined => {
    const authUserId = request.auth?.id;
    const requestUserId = Array.isArray(request.params.id)
        ? request.params.id[0]
        : request.params.id;

    if (authUserId && requestUserId !== authUserId) {
        response.status(403).json({
            status: 403,
            message: 'Forbidden. You can only access your own profile.'
        });

        return undefined;
    }

    return requestUserId;
};

router.get(
    '/user/:id/profile',
    authHandler.required,
    async (request: AuthRequest, response: Response, next: NextFunction) => {
        try {
            const userId = ensureUserMatchesAuth(request, response);

            if (!userId) {
                return;
            }

            const profile = await getProfile(userId);
            response.status(200).json(profile);
        } catch (error) {
            next(error);
        }
    }
);

router.post(
    '/user/:id/profile',
    authHandler.required,
    async (
        request: Request<{ id: string }, unknown, { profile: UserProfile }> & {
            auth?: { id?: string };
        },
        response: Response,
        next: NextFunction
    ) => {
        try {
            const userId = ensureUserMatchesAuth(request, response);

            if (!userId) {
                return;
            }

            const profile = await createProfile(userId, request.body.profile);
            response.status(201).json(profile);
        } catch (error) {
            next(error);
        }
    }
);

router.patch(
    '/user/:id/profile',
    authHandler.required,
    async (
        req: Request<{ id: string }, unknown, { profile: UserProfilePatch }> & {
            auth?: { id?: string };
        },
        res: Response,
        next: NextFunction
    ) => {
        try {
            const userId = ensureUserMatchesAuth(req, res);

            if (!userId) {
                return;
            }

            const profile = await updateProfile(userId, req.body.profile ?? {});
            res.status(200).json(profile);
        } catch (error) {
            next(error);
        }
    }
);

export default router;
