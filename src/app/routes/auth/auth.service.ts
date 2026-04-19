import HttpException from '@/app/models/HttpException';
import { AuthResponse } from '@/app/routes/auth/auth-response.model';
import {
    createAuthData,
    getPasswordById,
    getUserByEmail,
    mergeUser
} from '@/app/routes/auth/auth.repository';
import { LoginInput } from '@/db/login-input.model';
import { RegisterInput } from '@/db/register-input.model';
import { User } from '@/db/user.model';
import * as bcrypt from 'bcryptjs';
import type { Secret } from 'jsonwebtoken';
import * as jwt from 'jsonwebtoken';

const login = async (
    loginPayload: Partial<LoginInput>
): Promise<AuthResponse> => {
    const email = loginPayload.email?.trim();
    const password = loginPayload.password?.trim();

    if (!email) {
        throw new HttpException(422, 'Email cannot be blank.');
    }

    if (!password) {
        throw new HttpException(422, 'Password cannot be blank.');
    }

    const user = await getUserByEmail(email);

    if (user) {
        const passwordHash = await getPasswordById(user.id);

        if (passwordHash && (await bcrypt.compare(password, passwordHash))) {
            return { user, token: generateToken(user) };
        }
    }

    throw new HttpException(403, 'Login failed!');
};

const register = async (
    registerPayload: RegisterInput
): Promise<AuthResponse> => {
    const email = registerPayload.email?.trim();
    const password = registerPayload.password?.trim();
    const firstName = registerPayload.firstName?.trim();
    const lastName = registerPayload.lastName?.trim();
    const dateOfBirth = registerPayload.dateOfBirth?.trim();
    const phone = registerPayload.phone?.trim();

    if (!email) {
        throw new HttpException(422, 'Email cannot be blank.');
    }

    if (!password) {
        throw new HttpException(422, 'Password cannot be blank.');
    }

    if (!firstName) {
        throw new HttpException(422, 'First name cannot be blank.');
    }

    if (!lastName) {
        throw new HttpException(422, 'Last name cannot be blank.');
    }

    if (!dateOfBirth) {
        throw new HttpException(422, 'Date of birth cannot be blank.');
    }

    if (!phone) {
        throw new HttpException(422, 'Phone cannot be blank.');
    }

    if (!registerPayload.address) {
        throw new HttpException(422, 'Address cannot be blank.');
    }

    const street = registerPayload.address.street?.trim();
    const houseNumber = registerPayload.address.houseNumber?.trim();
    const zipCode = registerPayload.address.zipCode?.trim();
    const locality = registerPayload.address.locality?.trim();

    if (!street) {
        throw new HttpException(422, 'Street cannot be blank.');
    }

    if (!houseNumber) {
        throw new HttpException(422, 'House number cannot be blank.');
    }

    if (!zipCode) {
        throw new HttpException(422, 'Zip code cannot be blank.');
    }

    if (!locality) {
        throw new HttpException(422, 'Locality cannot be blank.');
    }

    const userExists = await getUserByEmail(email);

    if (userExists) {
        throw new HttpException(
            422,
            'A user with this email address does already exist.'
        );
    }

    const normalizedPayload: RegisterInput = {
        ...registerPayload,
        email,
        password,
        firstName,
        lastName,
        dateOfBirth,
        phone,
        address: {
            street,
            houseNumber,
            zipCode,
            locality
        }
    };

    const user = await mergeUser(normalizedPayload);

    await createAuthData(user, password);

    return { user, token: generateToken(user) };
};

const generateToken = (user: User): string =>
    jwt.sign(user, process.env.VITE_JWT_SECRET as Secret, {
        expiresIn: '1h'
    });

export { login, register };

