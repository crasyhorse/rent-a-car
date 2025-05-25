import { Router } from 'express';
import MainController from '@/app/routes/main/main.controller.js';
import CarController from '@/app/routes/cars/car.controller.js';
import AuthController from '@/app/routes/auth/auth.controller.js';

const router = Router();

const api = router.use(MainController).use(CarController).use(AuthController);

export default router.use('/api/v1', api);