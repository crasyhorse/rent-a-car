import authHandler from '@/app/middleware/authorizationHandler';
import {
    getCar,
    listCars,
    listInsurances,
    listOptions
} from '@/app/routes/cars/car.service';
import { NextFunction, Request, Response, Router } from 'express';

const router = Router();

router.get(
    '/cars/',
    authHandler.optional,
    async (_request: Request, response: Response, next: NextFunction) => {
        try {
            const result = await listCars();
            response.json(result);
        } catch (error) {
            next(error);
        }
    }
);

router.get(
    '/cars/insurances',
    authHandler.optional,
    async (_request: Request, response: Response, next: NextFunction) => {
        try {
            const result = await listInsurances();
            response.json(result);
        } catch (error) {
            next(error);
        }
    }
);

router.get(
    '/cars/:id',
    authHandler.optional,
    async (
        request: Request<{ id: string }>,
        response: Response,
        next: NextFunction
    ) => {
        try {
            const result = await getCar(request.params.id);
            response.json(result);
        } catch (error) {
            next(error);
        }
    }
);

router.get(
    '/cars/options',
    authHandler.optional,
    async (_request: Request, response: Response, next: NextFunction) => {
        try {
            const result = await listOptions();
            response.json(result);
        } catch (error) {
            next(error);
        }
    }
);

export default router;
