import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
    createAuthData,
    getUserByEmail,
    getUserById,
    getPasswordById,
    mergeUser
} from '@/app/routes/auth/auth.repository';
import * as Db from '@/db/db';
import type { User } from '@/db/user.model';
import type { Database } from '@/db/database.model';
import HttpException from '@/app/models/HttpException';
import { RegisterInput } from '@/db/register-input.model';

describe.only('auth.repository', () => {
    const expectedUser = {
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

    describe('createAuthData', () => {
        it('writes userId and passwort to the database.', async () => {
            // Arrange
            const writeDatabaseSpy = vi
                .spyOn(Db, 'writeDatabase')
                .mockImplementation(async () => Promise.resolve());

            // Act
            await createAuthData(expectedUser, 't0Ps3crät');

            expect(writeDatabaseSpy).toHaveResolved();
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
                await expect(
                    getUserById('danieldeskclerk@example.com')
                ).resolves.toMatchSnapshot();
            });

            it('undefined if the user does not exist.', async () => {
                await expect(
                    getUserById('danieldeskclerk@example.com')
                ).resolves.toBeUndefined();
            });
        });
    });

    describe('getPasswordById', () => {
        describe('returns', () => {
            it("should return the user's password hash", async () => {
                const userId = '8dd01190-e7c4-44f5-bcff-739565d8ea5a';

                await expect(
                    getPasswordById(userId)
                ).resolves.toMatchInlineSnapshot(
                    `"$2a$10$3vHJMxWUCFcN/bjE4KSane1ui3bpDpuNYfxDvnZdOcFXD9zxtIc3m"`
                );
            });

            it("should return undefined if there is no password for this user's id", async () => {
                const nonexistingUserId =
                    '66601190-4711-0815-bcff-739565d8ea5a';

                await expect(
                    getPasswordById(nonexistingUserId)
                ).resolves.toBeUndefined();
            });
        });
    });

    describe('mergeUser', () => {
        let data: Database;

        beforeEach(async () => {
            const _databaseContent = await Db.readDatabase();
            data = { ..._databaseContent };
        });

        afterEach(async () => {
            await Db.writeDatabase(data);
        });

        describe('returns', () => {
            it('an updated user if the user already exists.', async () => {
                // Arrange
                const writeDatabaseSpy = vi
                    .spyOn(Db, 'writeDatabase')
                    .mockImplementation(async () => Promise.resolve());
                const data: Database = await Db.readDatabase();
                const updatedUser = { ...expectedUser };
                updatedUser.dateOfBirth = '2000-01-14';
                const idx = data.users.findIndex(
                    (user) => (user.id = expectedUser.id)
                );
                // Act
                const mergedUser = await mergeUser(updatedUser);
                data.users[idx] = mergedUser;

                // Assert
                expect(mergedUser.dateOfBirth).toBe('2000-01-14');
                expect(writeDatabaseSpy).toHaveResolved();
                expect(writeDatabaseSpy).toHaveBeenCalledWith(data);
            });

            it('a new user if the user does not exist.', async () => {
                // Arrange
                const writeDatabaseSpy = vi
                    .spyOn(Db, 'writeDatabase')
                    .mockImplementation(async () => Promise.resolve());
                const data: Database = await Db.readDatabase();
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

                // Act
                const mergedUser = await mergeUser(registerInput);
                data.users.push(mergedUser);

                // Assert
                expect(writeDatabaseSpy).toHaveResolved();
                expect(writeDatabaseSpy).toHaveBeenCalledWith(data);

                expect(mergedUser).toHaveProperty('id');
                expect(mergedUser).not.toHaveProperty('password');
            });
        });
    });
});

