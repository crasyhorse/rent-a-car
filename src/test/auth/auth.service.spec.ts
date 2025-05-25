import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { login, register } from '@/app/routes/auth/auth.service';
import { LoginInput } from '@/app/routes/auth/login-input.model';
import { RegisterInput } from '@/app/routes/auth/register-input.model';
import HttpException from '@/app/models/HttpException';
import type { Database } from '@/db/database.model';
import { writeDatabase, readDatabase } from '@/db/db';

describe('auth.service', () => {
    describe('login', () => {
        describe('returns', () => {
            it('an authenticated user with a jwt.', async () => {
                const loginInput: LoginInput = {
                    email: 'danieldeskclerk@example.com',
                    password: 'password'
                };

                const user = await login(loginInput);

                expect(user.email).toMatch('danieldeskclerk@example.com');
                expect(user).toHaveProperty('token');
                expect(user.token).toBeTypeOf('string');
            });
        });

        describe('throws', () => {
            const expected403Error = new HttpException(403, 'Login failed!');

            it('an HTTP 403 if the user does not exist.', async () => {
                const loginInput: LoginInput = {
                    email: 'nonexistinguser@example.com',
                    password: 'password'
                };

                await expect(login(loginInput)).rejects.toThrowError(
                    expected403Error
                );
            });

            it('an HTTP 403 if there is not password hash for the user.', async () => {
                const loginInput: LoginInput = {
                    email: 'missingauth@example.com',
                    password: 'password'
                };

                await expect(login(loginInput)).rejects.toThrowError(
                    expected403Error
                );
            });

            it('an HTTP 403 if the password is wrong.', async () => {
                const loginInput: LoginInput = {
                    email: 'danieldeskclerk@example.com',
                    password: 'wrong-password'
                };

                await expect(login(loginInput)).rejects.toThrowError(
                    expected403Error
                );
            });

            [
                { field: 'email', message: 'Email cannot be blank' },
                { field: 'password', message: 'Password cannot be blank' }
            ].forEach(({ field, message }) => {
                it(`a HTTP 422 if ${field} is empty.`, async () => {
                    const loginInput: LoginInput = {
                        email: 'nonexistinguser@example.com',
                        password: 'password'
                    };

                    // @ts-expect-error This syntax is used in tests only
                    loginInput[field] = null;

                    const expected422Error = new HttpException(422, message);

                    await expect(login(loginInput)).rejects.toThrowError(
                        expected422Error
                    );
                });
            });
        });
    });

    describe('register', () => {
        describe('returns', () => {
            let databaseContent: Database;

            beforeEach(async () => {
                const _databaseContent = await readDatabase();
                databaseContent = { ..._databaseContent };
            });

            afterEach(async () => {
                await writeDatabase(databaseContent);
            });

            it('an active user.', async () => {
                const registerInput: RegisterInput = {
                    email: 'clairevoyant@example.com',
                    firstName: 'Claire',
                    lastName: 'Voyant',
                    dateOfBirth: '2004-06-27',
                    driversLicense: 'G453HIF0815',
                    address: {
                        street: 'Golden Ave',
                        houseNumber: '724',
                        zipCode: 'NJ 07049',
                        locality: 'Secaucus'
                    },
                    password: 'password'
                };

                const user = await register(registerInput);

                expect(user.email).toMatch('clairevoyant@example.com');
                expect(user).toHaveProperty('token');
                expect(user.token).toBeTypeOf('string');
            });
        });

        describe('throws', () => {
            it('an HTTP 422 if a user with this email address does already exist.', async () => {
                const registerInput: RegisterInput = {
                    email: 'danieldeskclerk@example.com',
                    firstName: 'Daniel',
                    lastName: 'Deskclerk',
                    dateOfBirth: '2000-01-13',
                    driversLicense: 'F352GGE4711',
                    address: {
                        street: 'Garrison Ave',
                        houseNumber: '54',
                        zipCode: 'NJ 07306',
                        locality: 'Jersey City'
                    },
                    password: 'password'
                };

                const expectedError = new HttpException(
                    422,
                    'A user with this email address does already exist.'
                );

                await expect(() =>
                    register(registerInput)
                ).rejects.toThrowError(expectedError);
            });

            [
                { field: 'email', message: 'Email cannot be blank.' },
                { field: 'password', message: 'Password cannot be blank.' },
                {
                    field: 'dateOfBirth',
                    message: 'Date of birth cannot be blank.'
                },
                {
                    field: 'driversLicense',
                    message: 'Drivers license cannot be blank.'
                }
            ].forEach(({ field, message }) => {
                it(`an HTTP 422 if ${field} is empty.`, async () => {
                    const registerInput: RegisterInput = {
                        email: 'unclesam@example.com',
                        firstName: 'Uncle',
                        lastName: 'Sam',
                        dateOfBirth: '1987-07-24',
                        driversLicense: 'J461HHF4712',
                        address: {
                            street: 'Park Ave',
                            houseNumber: '617',
                            zipCode: 'NJ 07030',
                            locality: 'Hoboken'
                        },
                        password: 'password'
                    };

                    // @ts-expect-error This syntax is used in tests only
                    registerInput[field] = null;

                    const expectedError = new HttpException(422, message);

                    await expect(() =>
                        register(registerInput)
                    ).rejects.toThrowError(expectedError);
                });
            });
        });
    });
});

