import type { UserProfile } from '@/db/user-profile.model';

export interface Address {
    street: string;
    houseNumber: string;
    zipCode: string;
    locality: string;
}

export interface DriverLicense {
    numberMasked: string;
    country: string;
    expiryDate: string;
    verified: boolean;
}

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    phone: string;
    driverLicense?: DriverLicense;
    address: Address;
    profile?: UserProfile;
}