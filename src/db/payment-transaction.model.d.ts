export type PaymentStatus =
    | 'authorized'
    | 'submitted'
    | 'rejected'
    | 'requires_action';

interface BookingReferenceInput {
    carId: string;
    startDate: string;
    endDate: string;
}

export interface CreditCardPaymentInput {
    booking: BookingReferenceInput;
    amount: number;
    currency: string;
    cardNumber: string;
    owner: string;
    expirationDate: string;
    securityId: string;
}

export interface SepaDirectDebitPaymentInput {
    booking: BookingReferenceInput;
    amount: number;
    currency: string;
    accountHolder: string;
    iban: string;
    bic: string;
    creditInstitute: string;
}

export interface PaymentTransaction {
    id: string;
    userId: string;
    bookingReference: string;
    amount: number;
    currency: string;
    method: 'credit-card' | 'sepa-direct-debit';
    status: PaymentStatus;
    createdAt: string;
    details: Record<string, unknown>;
}
