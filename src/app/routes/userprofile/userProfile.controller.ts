import authHandler from '@/app/middleware/authorizationHandler';
import {
    createProfile,
    getProfile,
    updateProfile
} from '@/app/routes/userprofile/userProfile.service';
import { AuthRequest, ensureUserMatchesAuth } from '@/app/routes/utilities';
import type { UserProfile, UserProfilePatch } from '@/db/user-profile.model';
import { NextFunction, Response, Router } from 'express';

const router = Router();

router.get(
    '/user/:id/profile',
    authHandler.required,
    async (
        request: AuthRequest<{ id: string }>,
        response: Response,
        next: NextFunction
    ) => {
        try {
            const userId = ensureUserMatchesAuth(request, 'id');

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
        request: AuthRequest<{ id: string }, { profile: UserProfile }>,
        response: Response,
        next: NextFunction
    ) => {
        try {
            const userId = ensureUserMatchesAuth(request, 'id');

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
        request: AuthRequest<{ id: string }> & {
            body: { profile: UserProfilePatch };
        },
        response: Response,
        next: NextFunction
    ) => {
        try {
            const userId = ensureUserMatchesAuth(request, 'id');

            const profile = await updateProfile(
                userId,
                request.body.profile ?? {}
            );
            response.status(200).json(profile);
        } catch (error) {
            next(error);
        }
    }
);

export default router;

