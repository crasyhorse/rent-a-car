interface Address {
    street: string;
    houseNumber: string;
    zipCode: string;
    locality: string;
}

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    driversLicense: string;
    address: Address;
}

