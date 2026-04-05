import AuthController from '@/app/routes/auth/auth.controller';
import BookingController from '@/app/routes/booking/booking.controller';
import CarController from '@/app/routes/cars/car.controller';
import MainController from '@/app/routes/main/main.controller';
import PaymentController from '@/app/routes/payment/payment.controller';
import ProfileController from '@/app/routes/userprofile/userProfile.controller';
import { Router } from 'express';

const router = Router();

const api = router
    .use(MainController)
    .use(CarController)
    .use(AuthController)
    .use(BookingController)
    .use(ProfileController)
    .use(PaymentController);

export default router.use('/api/v1', api);

