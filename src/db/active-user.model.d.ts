import { User } from '@/db/user.model';

export interface ActiveUser extends User {
    token: string;
}
