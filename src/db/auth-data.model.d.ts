import { RegisterInput } from '@/db/register-input.model';

export interface AuthData {
    id: RegisterInput['id'];
    password: RegisterInput['password'];
}
