import { RegisterInput } from '@/app/routes/auth/register-input.model';
import { LoginInput } from '@/app/routes/auth/login-input.model';
import { User } from '@/db/user.model';
import { ActiveUser } from '@/db/active-user.model';
import HttpException from '@/app/models/HttpException.js';
import * as bcrypt from 'bcryptjs';
import {
    createAuthData,
    getPasswordById,
    getUserByEmail,
    mergeUser,
    userIsUnique
} from '@/app/routes/auth//auth.repository.js';
import * as jwt from 'jsonwebtoken';
import type { Secret } from 'jsonwebtoken';

const login = async (loginPayload: LoginInput): Promise<ActiveUser | never> => {
    const email = loginPayload.email?.trim();
    const password = loginPayload.password?.trim();

    if (!email) {
        throw new HttpException(422, 'Email cannot be blank');
    }

    if (!password) {
        throw new HttpException(422, 'Password cannot be blank');
    }

    const user = await getUserByEmail(email);

    if (user) {
        const passwordHash = await getPasswordById(user.id);

        if (
            passwordHash &&
            (await bcrypt.compare(password, passwordHash as string))
        ) {
            const activeUser: ActiveUser = {
                ...user,
                token: generateToken(user)
            };
            return activeUser;
        }
    }

    throw new HttpException(403, 'Login failed!');
};

const register = async (
    registerPayload: RegisterInput
): Promise<ActiveUser | never> => {
    const isUserUnique = await userIsUnique(registerPayload.email);
    if (!isUserUnique) {
        throw new HttpException(
            422,
            'A user with this email address does already exist.'
        );
    }

    const { email, password, dateOfBirth, driversLicense } = registerPayload;

    if (!email) {
        throw new HttpException(422, 'Email cannot be blank.');
    }

    if (!password) {
        throw new HttpException(422, 'Password cannot be blank.');
    }
    if (!dateOfBirth) {
        throw new HttpException(422, 'Date of birth cannot be blank.');
    }
    if (!driversLicense) {
        throw new HttpException(422, 'Drivers license cannot be blank.');
    }

    const user = await mergeUser(registerPayload);

    await createAuthData(user, registerPayload.password);

    return { ...user, token: generateToken(user) };
};

const generateToken = (user: User): string =>
    jwt.sign(user, process.env.VITE_JWT_SECRET as Secret, {
        expiresIn: '1h'
    });
export { login, register };

