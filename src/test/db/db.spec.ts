import { readDatabase, writeDatabase } from '@/db/db';
import * as database from '@/db/db';
import type { Database } from '@/db/database.model';
import type { User } from '@/db/user.model';
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';

describe('db', () => {
    let databaseContent: Database;

    beforeEach(async () => {
        const _databaseContent = await readDatabase();
        databaseContent = { ..._databaseContent };
    });

    afterEach(async () => {
        await writeDatabase(databaseContent);
    });

    describe('readDatabase', () => {
        describe('returns', () => {
            it('the contents of the database.', async () => {
                await expect(readDatabase()).resolves.toMatchSnapshot();
            });
        });

        describe('throws', () => {
            it('an error if the database does not exist.', async () => {
                vi.stubEnv('VITE_DATABASE_FILE', './non/existing/path/db.json');
                await expect(readDatabase()).rejects.toThrow();
                vi.unstubAllEnvs();
            });
        });
    });

    describe('writeDatabase', () => {
        describe('returns', () => {
            it('void after writing the data back into the database.', async () => {
                const databaseSpy = vi.spyOn(database, 'writeDatabase');
                const newUser: User = {
                    id: '4d453a44-00e2-431e-ae85-193f000fcd31',
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
                    }
                };

                const data: Database = await readDatabase();
                data.users.push(newUser);
                await database.writeDatabase(data);
                expect(databaseSpy).toHaveResolved();

                const newData: Database = await readDatabase();
                expect(newData.users).toContainEqual(newUser);
            });
        });
    });
});
