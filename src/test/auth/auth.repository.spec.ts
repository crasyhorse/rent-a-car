import HttpException from '@/app/models/HttpException';
import {
    createAuthData,
    getPasswordById,
    getUserByEmail,
    getUserById,
    mergeUser,
    userIsUnique
} from '@/app/routes/auth/auth.repository';
import type { Database } from '@/db/database.model';
import * as DB from '@/db/db';
import { RegisterInput } from '@/db/register-input.model';
import type { User } from '@/db/user.model';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('auth.repository', () => {
    let databaseMock: Database;

    const expectedUser: User = {
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

    beforeEach(() => {
        databaseMock = {
            users: [],
            cars: [],
            auth: [],
            bookings: [],
            insurance: [],
            options: []
        };
    });
    afterEach(() => {
        vi.resetAllMocks();
        vi.restoreAllMocks();
    });

    describe('createAuthData', () => {
        it('writes userId and passwort to the database.', async () => {
            // Arrange
            const readDatabaseSpy = vi
                .spyOn(DB, 'readDatabase')
                .mockResolvedValue(databaseMock);
            const writeDatabaseSpy = vi
                .spyOn(DB, 'writeDatabase')
                .mockResolvedValue(undefined);

            // Act
            await createAuthData(expectedUser, 't0Ps3crät');

            // Assert
            expect(readDatabaseSpy).toHaveResolved();
            expect(writeDatabaseSpy).toHaveBeenCalledWith(
                expect.objectContaining({
                    auth: expect.arrayContaining([
                        expect.objectContaining({
                            id: '8dd01190-e7c4-44f5-bcff-739565d8ea5a'
                        })
                    ])
                })
            );
        });
    });

    describe('getUserByEmail', () => {
        describe('returns', () => {
            it('an authenticated user.', async () => {
                await expect(
                    getUserByEmail('danieldeskclerk@example.com')
                ).resolves.toMatchSnapshot();
            });

            it('undefined if the user does not exist.', async () => {
                await expect(
                    getUserByEmail('nonexistinguser@example.com')
                ).resolves.toBeUndefined();
            });
        });
    });

    describe('getUserById', () => {
        describe('returns', () => {
            it('an authenticated user.', async () => {
                // Arrange
                databaseMock.users.push(expectedUser);
                const readDatabaseSpy = vi
                    .spyOn(DB, 'readDatabase')
                    .mockResolvedValue(databaseMock);

                // Assert
                await expect(
                    getUserById('danieldeskclerk@example.com')
                ).resolves.toMatchSnapshot();
                expect(readDatabaseSpy).toHaveResolved();
            });

            it('undefined if the user does not exist.', async () => {
                // Arrange
                const readDatabaseSpy = vi
                    .spyOn(DB, 'readDatabase')
                    .mockResolvedValue(databaseMock);

                // Assert
                await expect(
                    getUserById('danieldeskclerk@example.com')
                ).resolves.toBeUndefined();
                expect(readDatabaseSpy).toHaveResolved();
            });
        });
    });

    describe('getPasswordById', () => {
        describe('returns', () => {
            it("should return the user's password hash", async () => {
                // Arrange
                databaseMock.auth.push({
                    id: '8dd01190-e7c4-44f5-bcff-739565d8ea5a',
                    password: `$2a$10$3vHJMxWUCFcN/bjE4KSane1ui3bpDpuNYfxDvnZdOcFXD9zxtIc3m`
                });
                const readDatabaseSpy = vi
                    .spyOn(DB, 'readDatabase')
                    .mockResolvedValue(databaseMock);

                const userId = '8dd01190-e7c4-44f5-bcff-739565d8ea5a';

                await expect(
                    getPasswordById(userId)
                ).resolves.toMatchInlineSnapshot(
                    `"$2a$10$3vHJMxWUCFcN/bjE4KSane1ui3bpDpuNYfxDvnZdOcFXD9zxtIc3m"`
                );
                expect(readDatabaseSpy).toHaveResolved();
            });

            it("should return undefined if there is no password for this user's id", async () => {
                // Arrange
                const readDatabaseSpy = vi
                    .spyOn(DB, 'readDatabase')
                    .mockResolvedValue(databaseMock);

                const nonexistingUserId =
                    '66601190-4711-0815-bcff-739565d8ea5a';

                await expect(
                    getPasswordById(nonexistingUserId)
                ).resolves.toBeUndefined();
                expect(readDatabaseSpy).toHaveResolved();
            });
        });
    });

    describe('mergeUser', () => {
        describe('returns', () => {
            it('an updated user if the user already exists.', async () => {
                // Arrange
                databaseMock.users.push(expectedUser);
                const readDatabaseSpy = vi
                    .spyOn(DB, 'readDatabase')
                    .mockResolvedValue(databaseMock);

                const updatedUser = { ...expectedUser };
                updatedUser.dateOfBirth = '2000-01-14';
                databaseMock.users.splice(0, 1);
                databaseMock.users.push(updatedUser);
                const writeDatabaseSpy = vi
                    .spyOn(DB, 'writeDatabase')
                    .mockResolvedValue(undefined);

                // Act
                const mergedUser = await mergeUser(updatedUser);

                // Assert
                expect(mergedUser.dateOfBirth).toBe('2000-01-14');
                expect(writeDatabaseSpy).toHaveBeenCalledWith(
                    expect.objectContaining({
                        users: expect.arrayContaining([
                            expect.objectContaining({
                                id: '8dd01190-e7c4-44f5-bcff-739565d8ea5a',
                                dateOfBirth: '2000-01-14'
                            })
                        ])
                    })
                );
            });

            it('a new user if the user does not exist.', async () => {
                // Arrange
                const readDatabaseSpy = vi
                    .spyOn(DB, 'readDatabase')
                    .mockResolvedValue(databaseMock);

                const registerInput: RegisterInput = {
                    email: 'clairevoyant@example.com',
                    firstName: 'Claire',
                    lastName: 'Voyant',
                    dateOfBirth: '2004-06-27',
                    phone: '123-555-6754',
                    address: {
                        street: 'Golden Ave',
                        houseNumber: '724',
                        zipCode: 'NJ 07049',
                        locality: 'Secaucus'
                    },
                    password: 'password'
                };
                // @ts-expect-error Suppressed because of testing purposes
                databaseMock.users.push(registerInput);
                const writeDatabaseSpy = vi
                    .spyOn(DB, 'writeDatabase')
                    .mockResolvedValue(undefined);

                // Act
                const mergedUser = await mergeUser(registerInput);

                // Assert
                expect(mergedUser).toHaveProperty('id');
                expect(mergedUser).not.toHaveProperty('password');
                expect(readDatabaseSpy).toHaveResolved();

                expect(writeDatabaseSpy).toHaveBeenCalledWith(
                    expect.objectContaining({
                        users: expect.arrayContaining([
                            expect.objectContaining({
                                firstName: 'Claire',
                                lastName: 'Voyant',
                                dateOfBirth: '2004-06-27'
                            })
                        ])
                    })
                );
            });
        });

        describe('throws', () => {
            it('A problem occured when you tried to update this user.', async () => {
                // Arrange
                const expected422Error = new HttpException(
                    422,
                    'A problem occured when you tried to update this user.'
                );
                const readDatabaseSpy = vi
                    .spyOn(DB, 'readDatabase')
                    .mockResolvedValue(databaseMock);
                const nonExistingUser = expectedUser;
                nonExistingUser.id = '4ec570ea-3afd-4fad-af60-dad23d4c7d37';
                const writeDatabaseSpy = vi.spyOn(DB, 'writeDatabase');

                // Assert
                await expect(mergeUser(nonExistingUser)).rejects.toThrow(
                    expected422Error
                );
                expect(writeDatabaseSpy).not.toHaveResolved();
                expect(readDatabaseSpy).toHaveResolved();
            });
        });
    });
});

