import type { User } from '@/db/user.model';

export interface RegisterInput extends Omit<
    User,
    'id' | 'driverLicense' | 'profile'
> {
    password: string;
}

export type RawRegisterInput = Omit<Partial<RegisterInput>, 'address'> & {
    address?: Partial<RegisterInput['address']>;
};
