import { NextFunction, Response, Router } from 'express';
import authHandler from '@/app/middleware/authorizationHandler';
import {
    payByCreditCard,
    payBySepaDirectDebit
} from '@/app/routes/payment/payment.service';
import type {
    CreditCardPaymentInput,
    SepaDirectDebitPaymentInput
} from '@/db/payment.model';
import { AuthRequest, ensureUserMatchesAuth } from '@/app/routes/utilities';

const router = Router();

router.post(
    '/payments/credit-card/:customerId',
    authHandler.required,
    async (
        request: AuthRequest<
            { customerId: string },
            { payment: CreditCardPaymentInput }
        >,
        response: Response,
        next: NextFunction
    ) => {
        try {
            const userId = ensureUserMatchesAuth(request, 'customerId');

            const transaction = await payByCreditCard(
                userId,
                request.body.payment
            );

            response.status(201).json(transaction);
        } catch (error) {
            next(error);
        }
    }
);

router.post(
    '/payments/sepa-direct-debit/:customerId',
    authHandler.required,
    async (
        request: AuthRequest<
            { customerId: string },
            { payment: SepaDirectDebitPaymentInput }
        >,
        response: Response,
        next: NextFunction
    ) => {
        try {
            const userId = ensureUserMatchesAuth(request, 'customerId');

            const transaction = await payBySepaDirectDebit(
                userId,
                request.body.payment
            );

            response.status(201).json(transaction);
        } catch (error) {
            next(error);
        }
    }
);

export default router;
