import { RegisterInput } from '@/db/register-input.model';

export interface LoginInput extends Pick<RegisterInput, 'email'> {
    password: RegisterInput['password'];
}

