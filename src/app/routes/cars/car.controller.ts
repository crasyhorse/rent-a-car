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
    async (_req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await listCars();
            res.json(result);
        } catch (error) {
            next(error);
        }
    }
);

router.get(
    '/cars/insurances',
    authHandler.optional,
    async (_req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await listInsurances();
            res.json(result);
        } catch (error) {
            next(error);
        }
    }
);

router.get(
    '/cars/:id',
    authHandler.optional,
    async (
        req: Request<{ id: string }>,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const result = await getCar(req.params.id);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }
);

router.get(
    '/cars/options',
    authHandler.optional,
    async (_req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await listOptions();
            res.json(result);
        } catch (error) {
            next(error);
        }
    }
);

export default router;
