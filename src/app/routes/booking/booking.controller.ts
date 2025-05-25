import { NextFunction, Response, Request, Router } from 'express';
import authHandler from '@/app/middleware/authorizationHandler';
import { executeBooking } from '@/app/routes/booking/booking.service.js';

const router = Router();

router.post(
    '/bookings/:customerId',
    authHandler.required,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const booking = await executeBooking(req.body.data);
            res.status(201).json(booking);
        } catch (error) {
            next(error);
        }
    }
);

