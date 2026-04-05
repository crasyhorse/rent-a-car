import authHandler from '@/app/middleware/authorizationHandler';
import {
    cancelBooking,
    executeBooking
} from '@/app/routes/booking/booking.service';
import { RawBookingDataInput } from '@/db/booking-data-input.model';
import { NextFunction, Request, Response, Router } from 'express';

const router = Router();

router.post(
    '/bookings/:customerId',
    authHandler.required,
    async (
        request: Request<
            { customerId: string },
            unknown,
            { data: RawBookingDataInput }
        >,
        response: Response,
        next: NextFunction
    ) => {
        try {
            const authUserId = (request as Request & { auth?: { id?: string } })
                .auth?.id;

            if (request.params.customerId !== request.body.data?.userId) {
                response.status(422).json({
                    status: 422,
                    message:
                        'Customer id in path does not match payload user id.'
                });
                return;
            }

            if (authUserId && request.params.customerId !== authUserId) {
                response.status(403).json({
                    status: 403,
                    message:
                        'Forbidden. You can only create bookings for yourself.'
                });
                return;
            }

            if (authUserId && req.params.customerId !== authUserId) {
                res.status(403).json({
                    status: 403,
                    message: 'Forbidden. You can only create bookings for yourself.'
                });

                return;
            }

            const booking = await executeBooking(req.body.data);
            res.status(201).json(booking);
        } catch (error) {
            next(error);
        }
    }
);

export default router;
