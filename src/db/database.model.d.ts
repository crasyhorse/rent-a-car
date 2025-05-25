import { User } from '@/db/user.model';
import { AuthData } from './auth-data.model';

export interface Database {
    cars: [];
    users: User[];
    auth: AuthData[];
}

