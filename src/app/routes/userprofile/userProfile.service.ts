import HttpException from '@/app/models/HttpException';
import {
    getUserProfileById,
    upsertUserProfile
} from '@/app/routes/userprofile/userProfile.repository';
import type {
    CreditCardPaymentMethod,
    UserPaymentMethod,
    UserProfile,
    UserProfilePatch
} from '@/db/user-profile.model';

const ALLOWED_PAYMENT_TYPES = [
    'credit-card',
    'sepa-credit-transfer',
    'sepa-direct-debit'
] as const;

const getProfile = async (userId: string): Promise<UserProfile> => {
    const profile = await getUserProfileById(userId);

    if (!profile) {
        throw new HttpException(404, 'Profile not found.');
    }

    return profile;
};

const createProfile = async (
    userId: string,
    profile: UserProfile
): Promise<UserProfile> => {
    validateProfile(profile);

    return upsertUserProfile(userId, profile);
};

const updateProfile = async (
    userId: string,
    profilePatch: UserProfilePatch
): Promise<UserProfile> => {
    const currentProfile = await getUserProfileById(userId);

    if (!currentProfile) {
        throw new HttpException(
            404,
            'Profile does not exist yet. Please create it first.'
        );
    }

    const mergedProfile: UserProfile = {
        ...currentProfile,
        ...profilePatch,
        paymentMethods:
            profilePatch.paymentMethods ?? currentProfile.paymentMethods,
        defaultPaymentMethodId:
            profilePatch.defaultPaymentMethodId ??
            currentProfile.defaultPaymentMethodId
    };

    validateProfile(mergedProfile);

    return upsertUserProfile(userId, mergedProfile);
};

const validateProfile = (profile: UserProfile): void => {
    validatePaymentMethods(profile.paymentMethods);
    validateDefaultPaymentMethod(
        profile.defaultPaymentMethodId,
        profile.paymentMethods
    );
};

const validatePaymentMethods = (
    paymentMethods: UserPaymentMethod[] | undefined
): void => {
    if (paymentMethods === undefined) {
        return;
    }

    if (!Array.isArray(paymentMethods)) {
        throw new HttpException(422, 'Payment methods must be an array.');
    }

    paymentMethods.forEach(validatePaymentMethod);
};

const validatePaymentMethod = (paymentMethod: UserPaymentMethod): void => {
    if (!paymentMethod.id) {
        throw new HttpException(422, 'Every payment method requires an id.');
    }

    if (!ALLOWED_PAYMENT_TYPES.includes(paymentMethod.type)) {
        throw new HttpException(
            422,
            'Unsupported payment method type. Use credit-card, sepa-credit-transfer or sepa-direct-debit.'
        );
    }

    switch (paymentMethod.type) {
        case 'credit-card':
            validateCreditCard(paymentMethod);
            return;

        case 'sepa-direct-debit':
            if (
                !paymentMethod.iban ||
                !paymentMethod.bic ||
                !paymentMethod.creditInstitute
            ) {
                throw new HttpException(
                    422,
                    'SEPA direct debit requires iban, bic and creditInstitute.'
                );
            }
            return;

        case 'sepa-credit-transfer':
            return;
    }
};

const validateCreditCard = (paymentMethod: CreditCardPaymentMethod): void => {
    if (
        !paymentMethod.cardNumber ||
        !paymentMethod.owner ||
        !paymentMethod.expirationDate ||
        !/^\d{3}$/.test(paymentMethod.securityId)
    ) {
        throw new HttpException(
            422,
            'Credit card requires cardNumber, owner, expirationDate and a 3-digit securityId.'
        );
    }
};

const validateDefaultPaymentMethod = (
    defaultPaymentMethodId: string | undefined,
    paymentMethods: UserPaymentMethod[] | undefined
): void => {
    if (!defaultPaymentMethodId) {
        return;
    }

    const methods = paymentMethods ?? [];

    if (methods.length === 0) {
        throw new HttpException(
            422,
            'defaultPaymentMethodId must reference one of the stored payment methods.'
        );
    }

    const exists = methods.some(
        (method) => method.id === defaultPaymentMethodId
    );

    if (!exists) {
        throw new HttpException(
            422,
            'defaultPaymentMethodId must reference one of the stored payment methods.'
        );
    }
};

export { createProfile, getProfile, updateProfile };
