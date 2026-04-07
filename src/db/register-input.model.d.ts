import type { User } from '@/db/user.model';

export interface RegisterInput extends Omit<
    User,
    'id' | 'driverLicense' | 'profile'
> {
    password: string;
}

