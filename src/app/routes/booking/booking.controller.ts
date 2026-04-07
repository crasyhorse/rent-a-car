import authHandler from '@/app/middleware/authorizationHandler';
import {
    cancelBooking,
    executeBooking
} from '@/app/routes/booking/booking.service';
import { AuthRequest, ensureUserMatchesAuth } from '@/app/routes/utilities';
import { RawBookingDataInput } from '@/db/booking-data-input.model';
import { NextFunction, Response, Router } from 'express';

const router = Router();

router.post(
    '/bookings/:customerId',
    authHandler.required,
    async (
        request: AuthRequest<{ customerId: string }, { data: RawBookingDataInput }>,
        response: Response,
        next: NextFunction
    ) => {
        try {
            const customerId = ensureUserMatchesAuth(request, 'customerId');

            if (customerId !== request.body.data?.customerId) {
                response.status(422).json({
                    status: 422,
                    message: 'Customer id does not match user id.'
                });
                return;
            }

            const booking = await executeBooking(request.body.data);
            response.status(201).json(booking);
        } catch (error) {
            next(error);
        }
    }
);

router.delete(
    '/bookings/:customerId/:bookingId',
    authHandler.required,
    async (
        request: AuthRequest<{ customerId: string; bookingId: string }>,
        response: Response,
        next: NextFunction
    ) => {
        try {
            const customerId = ensureUserMatchesAuth(request, 'customerId');

            await cancelBooking(request.params.bookingId, customerId);

            response.status(204).end();
        } catch (error) {
            next(error);
        }
    }
);

export default router;

