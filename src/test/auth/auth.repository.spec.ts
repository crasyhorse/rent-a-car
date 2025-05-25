import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
    getUserByEmail,
    getPasswordById,
    mergeUser
} from '@/app/routes/auth/auth.repository';
import { readDatabase, writeDatabase } from '@/db/db';
import type { User } from '@/db/user.model';
import type { Database } from '@/db/database.model';
import HttpException from '@/app/models/HttpException';
import { RegisterInput } from '@/app/routes/auth/register-input.model';

describe('auth.repository', () => {
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
        let databaseContent: Database;

        beforeEach(async () => {
            const _databaseContent = await readDatabase();
            databaseContent = { ..._databaseContent };
        });

        afterEach(async () => {
            await writeDatabase(databaseContent);
        });

        describe('returns', () => {
            it('an updated user if the user already exists.', async () => {
                const userId = '8dd01190-e7c4-44f5-bcff-739565d8ea5a';
                const email = 'danieldeskclerk@example.com';
                const authRepository = await import(
                    '@/app/routes/auth/auth.repository'
                );

                const updatedUser: User = {
                    id: '8dd01190-e7c4-44f5-bcff-739565d8ea5a',
                    email: 'danieldeskclerk@example.com',
                    firstName: 'Daniel',
                    lastName: 'Deskclerk',
                    dateOfBirth: '2000-01-14',
                    driversLicense: 'F352GGE4711',
                    address: {
                        street: 'Garrison Ave',
                        houseNumber: '54',
                        zipCode: 'NJ 07306',
                        locality: 'Jersey City'
                    }
                };

                const mergeUserSpy = vi.spyOn(authRepository, 'mergeUser');
                const mergedUser = await authRepository.mergeUser(updatedUser);
                const data: Database = await readDatabase();

                expect(mergeUserSpy).toHaveResolved();
                expect(mergedUser.id).toEqual(userId);
                expect(mergedUser.email).toEqual(email);
                expect(mergedUser).to.not.toHaveProperty('token');
                expect(mergedUser.dateOfBirth).toEqual(updatedUser.dateOfBirth);

                expect(data.users).toContainEqual(updatedUser);
            });

            it('a new user if the user does not exist.', async () => {
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

                const authRepository = await import(
                    '@/app/routes/auth/auth.repository'
                );

                const mergeUserSpy = vi.spyOn(authRepository, 'mergeUser');
                const mergedUser =
                    await authRepository.mergeUser(registerInput);
                const data: Database = await readDatabase();

                expect(mergeUserSpy).toHaveResolved();
                expect(mergedUser).toHaveProperty('id');
                expect(mergedUser).not.toHaveProperty('password');

                expect(data.users).toContainEqual(mergedUser);
            });
        });

        describe('throws', () => {
            it('an HTTP 422 if a user that should exist could not be found in the database.', async () => {
                const updatedUser: User = {
                    id: '8dd01190-4711-44f5-0815-739565d8ea5a',
                    email: 'danieldeskclerk@example.com',
                    firstName: 'Daniel',
                    lastName: 'Deskclerk',
                    dateOfBirth: '2000-01-14',
                    driversLicense: 'F352GGE4711',
                    address: {
                        street: 'Garrison Ave',
                        houseNumber: '54',
                        zipCode: 'NJ 07306',
                        locality: 'Jersey City'
                    }
                };

                await expect(mergeUser(updatedUser)).rejects.toThrowError(
                    new HttpException(
                        422,
                        'A problem occured when you tried to update this user.'
                    )
                );
            });
        });
    });
});

