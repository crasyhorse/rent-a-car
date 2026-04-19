import HttpException from '@/app/models/HttpException';
import * as AuthRepository from '@/app/routes/auth/auth.repository';
import { login, register } from '@/app/routes/auth/auth.service';
import { LoginInput } from '@/db/login-input.model';
import { RegisterInput } from '@/db/register-input.model';
import { User } from '@/db/user.model';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('auth.service', () => {
    let expectedUser: User;

    afterEach(() => {
        vi.resetAllMocks();
        vi.restoreAllMocks();
    });

    beforeEach(() => {
        expectedUser = {
            id: '8dd01190-e7c4-44f5-bcff-739565d8ea5a',
            email: 'danieldeskclerk@example.com',
            firstName: 'Daniel',
            lastName: 'Deskclerk',
            dateOfBirth: '2000-01-13',
            phone: '173-555-12345',
            driverLicense: {
                numberMasked: 'F352GGE4711',
                country: 'Germany',
                verified: true,
                expiryDate: '2028-01-13'
            },
            address: {
                street: 'Garrison Ave',
                houseNumber: '54',
                zipCode: 'NJ 07306',
                locality: 'Jersey City'
            }
        } satisfies User;
    });

    afterEach(() => {
        vi.resetAllMocks();
        vi.restoreAllMocks();
    });

    describe('login', () => {
        describe('returns', () => {
            it('an authenticated user with a jwt.', async () => {
                // Arrange
                const loginInput: LoginInput = {
                    email: 'danieldeskclerk@example.com',
                    password: 'password'
                };

                const getUserByEmailSpy = vi
                    .spyOn(AuthRepository, 'getUserByEmail')
                    .mockResolvedValue(expectedUser);

                const expectedPasswordHash =
                    '$2a$10$3vHJMxWUCFcN/bjE4KSane1ui3bpDpuNYfxDvnZdOcFXD9zxtIc3m';
                const getPasswordByIdSpy = vi
                    .spyOn(AuthRepository, 'getPasswordById')
                    .mockResolvedValue(expectedPasswordHash);

                // Act
                const response = await login(loginInput);

                // Assert
                expect(response.user.email).toBe('danieldeskclerk@example.com');
                expect(response).toHaveProperty('token');
                expect(response.token).toBeTypeOf('string');
                expect(getUserByEmailSpy).toHaveResolved();
                expect(getPasswordByIdSpy).toHaveResolved();
            });
        });

        describe('throws', () => {
            const expected403Error = new HttpException(403, 'Login failed!');

            it('an HTTP 403 if the user does not exist.', async () => {
                // Arrange
                const loginInput: LoginInput = {
                    email: 'nonexistinguser@example.com',
                    password: 'password'
                };

                const getUserByEmailSpy = vi
                    .spyOn(AuthRepository, 'getUserByEmail')
                    .mockResolvedValue(undefined);

                // Assert
                await expect(login(loginInput)).rejects.toThrow(
                    expected403Error
                );
                expect(getUserByEmailSpy).toHaveResolved();
            });

            it('an HTTP 403 if there is not password hash for the user.', async () => {
                // Arrange
                const loginInput: LoginInput = {
                    email: 'danieldeskclerk@example.com',
                    password: 'password'
                };

                const getUserByEmailSpy = vi
                    .spyOn(AuthRepository, 'getUserByEmail')
                    .mockResolvedValue(expectedUser);

                const expectedPasswordHash = undefined;

                const getPasswordByIdSpy = vi
                    .spyOn(AuthRepository, 'getPasswordById')
                    .mockResolvedValue(expectedPasswordHash);

                // Assert
                await expect(login(loginInput)).rejects.toThrow(
                    expected403Error
                );
                expect(getUserByEmailSpy).toHaveResolved();
                expect(getPasswordByIdSpy).toHaveResolved();
            });

            it('an HTTP 403 if the password is wrong.', async () => {
                // Arrange
                const loginInput: LoginInput = {
                    email: 'danieldeskclerk@example.com',
                    password: 'wrong-password'
                };

                const getUserByEmailSpy = vi
                    .spyOn(AuthRepository, 'getUserByEmail')
                    .mockResolvedValue(expectedUser);

                const expectedPasswordHash =
                    '$2a$10$3vHJMxWUCFcN/bjE4KSane1ui3bpDpuNYfxDvnZdOcFXD9zxtIc3m';
                const getPasswordByIdSpy = vi
                    .spyOn(AuthRepository, 'getPasswordById')
                    .mockResolvedValue(expectedPasswordHash);

                // Assert
                await expect(login(loginInput)).rejects.toThrow(
                    expected403Error
                );
                expect(getUserByEmailSpy).toHaveResolved();
                expect(getPasswordByIdSpy).toHaveResolved();
            });

            it.for([
                { field: 'email', message: 'Email cannot be blank.' },
                { field: 'password', message: 'Password cannot be blank.' }
            ])('a HTTP 422 if $field is empty.', async ({ field, message }) => {
                const loginInput: LoginInput = {
                    email: 'danieldeskclerk@example.com',
                    password: 'password'
                };

                // @ts-expect-error This syntax is used in tests only
                loginInput[field] = null;

                const expected422Error = new HttpException(422, message);

                await expect(login(loginInput)).rejects.toThrow(
                    expected422Error
                );
            });
        });
    });

    describe('register', () => {
        let registerInput: RegisterInput;

        beforeEach(() => {
            registerInput = {
                email: 'clairevoyant@example.com',
                firstName: 'Claire',
                lastName: 'Voyant',
                dateOfBirth: '2004-06-27',
                address: {
                    street: 'Golden Ave',
                    houseNumber: '724',
                    zipCode: 'NJ 07049',
                    locality: 'Secaucus'
                },
                password: 'password',
                phone: '011-555-12345'
            };
        });

        describe('returns', () => {
            it('an active user.', async () => {
                // Arrange
                const getUserByEmailSpy = vi
                    .spyOn(AuthRepository, 'getUserByEmail')
                    .mockResolvedValue(undefined);

                const mergedUser: User = {
                    ...registerInput,
                    id: '8dd01190-e7c4-44f5-bcff-739565d8ea5a'
                };

                const mergeUserSpy = vi
                    .spyOn(AuthRepository, 'mergeUser')
                    .mockResolvedValue(mergedUser);

                const createAuthDataSpy = vi
                    .spyOn(AuthRepository, 'createAuthData')
                    .mockResolvedValue(undefined);

                // Act
                const response = await register(registerInput);

                // Assert
                expect(response.user.email).toBe('clairevoyant@example.com');
                expect(response).toHaveProperty('token');
                expect(response.token).toBeTypeOf('string');
                expect(getUserByEmailSpy).toHaveResolved();
                expect(mergeUserSpy).toHaveResolved();
                expect(createAuthDataSpy).toHaveResolved();
            });
        });

        describe('throws', () => {
            it('an HTTP 422 if a user with this email address does already exist.', async () => {
                // Arrange
                const mergedUser: User = {
                    ...registerInput,
                    id: '8dd01190-e7c4-44f5-bcff-739565d8ea5a'
                };
                const getUserByEmailSpy = vi
                    .spyOn(AuthRepository, 'getUserByEmail')
                    .mockResolvedValue(mergedUser);

                registerInput.email = 'clairevoyant@example.com';

                const expectedError = new HttpException(
                    422,
                    'A user with this email address does already exist.'
                );

                await expect(() => register(registerInput)).rejects.toThrow(
                    expectedError
                );
                expect(getUserByEmailSpy).toHaveResolved()
            });

            it.for([
                { field: 'email', message: 'Email cannot be blank.' },
                { field: 'password', message: 'Password cannot be blank.' },
                { field: 'firstName', message: 'First name cannot be blank.' },
                { field: 'lastName', message: 'Last name cannot be blank.' },
                {
                    field: 'dateOfBirth',
                    message: 'Date of birth cannot be blank.'
                },
                { field: 'phone', message: 'Phone cannot be blank.' },
                { field: 'address', message: 'Address cannot be blank.' }
            ])(
                'an HTTP 422 if $field is empty.',
                async ({ field, message }) => {
                    // @ts-expect-error This syntax is used in tests only
                    registerInput[field] = null;

                    const expectedError = new HttpException(422, message);

                    await expect(() => register(registerInput)).rejects.toThrow(
                        expectedError
                    );
                }
            );

            it.for([
                { field: 'street', message: 'Street cannot be blank.' },
                {
                    field: 'houseNumber',
                    message: 'House number cannot be blank.'
                },
                { field: 'zipCode', message: 'Zip code cannot be blank.' },
                { field: 'locality', message: 'Locality cannot be blank.' }
            ])(
                'an HTTP 422 if $field is empty.',
                async ({ field, message }) => {
                    // @ts-expect-error This syntax is used in tests only
                    registerInput.address[field] = null;

                    const expectedError = new HttpException(422, message);

                    await expect(() => register(registerInput)).rejects.toThrow(
                        expectedError
                    );
                }
            );
        });
    });
});

