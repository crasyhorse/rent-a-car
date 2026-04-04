import { RegisterInput } from '@/app/routes/auth/register-input.model';

export interface LoginInput extends Pick<RegisterInput, 'email'> {
    password: RegisterInput['password'];
}

