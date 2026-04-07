import HttpException from '@/app/models/HttpException';
import { getBooking } from '@/app/routes/payment/payment.repository';
import type {
    CreditCardPaymentInput,
    PaymentTransaction,
    SepaDirectDebitPaymentInput
} from '@/db/payment.model';
import { randomUUID } from 'node:crypto';

const payByCreditCard = async (
    userId: string,
    paymentInput: CreditCardPaymentInput
): Promise<PaymentTransaction> => {
    await validatePaymentRequest(
        userId,
        paymentInput.booking,
        paymentInput.amount
    );

    validateCreditCardInput(paymentInput);

    return {
        id: randomUUID(),
        userId,
        bookingReference: bookingReference(paymentInput.booking),
        amount: paymentInput.amount,
        currency: paymentInput.currency,
        method: 'credit-card',
        status: 'authorized',
        createdAt: new Date().toISOString(),
        details: {
            acquirerReference: `CC-${Date.now()}`,
            maskedCardNumber: maskCardNumber(paymentInput.cardNumber),
            cardOwner: paymentInput.owner,
            authCode: String(Math.floor(Math.random() * 900000) + 100000)
        }
    };
};

const payBySepaDirectDebit = async (
    userId: string,
    paymentInput: SepaDirectDebitPaymentInput
): Promise<PaymentTransaction> => {
    await validatePaymentRequest(
        userId,
        paymentInput.booking,
        paymentInput.amount
    );

    validateSepaDirectDebitInput(paymentInput);

    const mandateReference = `MANDATE-${Date.now()}`;
    const mandateSignedAt = new Date().toISOString();

    return {
        id: randomUUID(),
        userId,
        bookingReference: bookingReference(paymentInput.booking),
        amount: paymentInput.amount,
        currency: paymentInput.currency,
        method: 'sepa-direct-debit',
        status: 'submitted',
        createdAt: new Date().toISOString(),
        details: {
            settlementEta: 'D+2 banking days',
            mandateReference,
            mandateSignedAt,
            debtorAccountMasked: maskIban(paymentInput.iban),
            creditorId: 'DE98ZZZ09999999999',
            accountHolder: paymentInput.accountHolder,
            bic: paymentInput.bic,
            creditInstitute: paymentInput.creditInstitute
        }
    };
};

const validatePaymentRequest = async (
    userId: string,
    booking: { carId: string; startDate: string; endDate: string },
    amount: number
): Promise<void> => {
    const storedBooking = await getBooking(
        userId,
        booking.carId,
        booking.startDate,
        booking.endDate
    );

    if (!storedBooking) {
        throw new HttpException(404, 'Booking not found for this user.');
    }

    if (!Number.isFinite(amount) || amount <= 0) {
        throw new HttpException(
            422,
            'Payment amount must be greater than zero.'
        );
    }
};

const validateCreditCardInput = (
    paymentInput: CreditCardPaymentInput
): void => {
    if (
        !paymentInput.cardNumber ||
        !paymentInput.owner ||
        !paymentInput.expirationDate ||
        !paymentInput.securityId
    ) {
        throw new HttpException(
            422,
            'Credit card payment requires cardNumber, owner, expirationDate and securityId.'
        );
    }

    if (!/^\d{3}$/.test(paymentInput.securityId)) {
        throw new HttpException(
            422,
            'Credit card securityId must contain 3 digits.'
        );
    }
};

const validateSepaDirectDebitInput = (
    paymentInput: SepaDirectDebitPaymentInput
): void => {
    if (
        !paymentInput.accountHolder ||
        !paymentInput.iban ||
        !paymentInput.bic ||
        !paymentInput.creditInstitute
    ) {
        throw new HttpException(
            422,
            'SEPA direct debit requires accountHolder, iban, bic and creditInstitute.'
        );
    }
};

const bookingReference = (booking: {
    carId: string;
    startDate: string;
    endDate: string;
}): string => `${booking.carId}:${booking.startDate}:${booking.endDate}`;

const maskCardNumber = (cardNumber: string): string =>
    cardNumber.length < 4 ? '****' : `**** **** **** ${cardNumber.slice(-4)}`;

const maskIban = (iban: string): string => {
    const compact = iban.replace(/\s/g, '');
    return compact.length < 4
        ? '****'
        : `${compact.slice(0, 4)}****************${compact.slice(-4)}`;
};

export { payByCreditCard, payBySepaDirectDebit };
