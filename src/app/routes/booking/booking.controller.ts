import { NextFunction, Response, Request, Router } from 'express';
import authHandler from '@/app/middleware/authorizationHandler';
import { executeBooking } from '@/app/routes/booking/booking.service.js';
import { BookingDataInput } from '@/db/booking-data-input.model';

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
            if (req.params.customerId !== req.body.data?.userId) {
                res.status(422).json({
                    status: 422,
                    message: 'Customer id in path does not match payload user id.'
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
