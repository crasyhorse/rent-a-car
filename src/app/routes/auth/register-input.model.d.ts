import type { User } from '@/db/user.model';

export interface RegisterInput extends Omit<User, 'id'> {
    password: string;
}

