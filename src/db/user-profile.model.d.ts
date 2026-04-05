export type PaymentMethodType =
    | 'credit-card'
    | 'sepa-credit-transfer'
    | 'sepa-direct-debit';

interface BasePaymentMethod {
    id: string;
    type: PaymentMethodType;
}

export interface CreditCardPaymentMethod extends BasePaymentMethod {
    type: 'credit-card';
    cardNumber: string;
    owner: string;
    expirationDate: string;
    securityId: string;
}

export interface SepaCreditTransferPaymentMethod extends BasePaymentMethod {
    type: 'sepa-credit-transfer';
}

export interface SepaDirectDebitPaymentMethod extends BasePaymentMethod {
    type: 'sepa-direct-debit';
    iban: string;
    bic: string;
    creditInstitute: string;
}

export type UserPaymentMethod =
    | CreditCardPaymentMethod
    | SepaCreditTransferPaymentMethod
    | SepaDirectDebitPaymentMethod;

export interface UserProfile {
    paymentMethods?: UserPaymentMethod[];
    defaultPaymentMethodId?: string;
}

export type UserProfilePatch = Partial<UserProfile>;
