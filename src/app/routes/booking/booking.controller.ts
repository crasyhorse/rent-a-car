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
        req: Request<{ customerId: string }, unknown, { data: BookingDataInput }>,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const authUserId = (req as Request & { auth?: { id?: string } }).auth
                ?.id;

            if (req.params.customerId !== req.body.data?.userId) {
                res.status(422).json({
                    status: 422,
                    message: 'Customer id in path does not match payload user id.'
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
