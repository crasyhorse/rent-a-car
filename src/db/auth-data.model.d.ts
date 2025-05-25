import { RegisterInput } from '@/app/routes/auth/register-input.model';

export interface AuthData {
    id: RegisterInput['id'];
    password: RegisterInput['password'];
}
