import { writeDatabase } from '@/db/db';
import type { Database } from '@/db/database.model';
import { describe, it, expect, vi, afterEach } from 'vitest';

vi.mock('node:fs/promises', async () => {
    const originalModule = await vi.importActual('node:fs/promises');
    return {
        ...originalModule,
        writeFile: vi
            .fn()
            .mockRejectedValue(
                new Error('Error writing data back to JSON file')
            )
    };
});

describe('db', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });
    describe('writeDatabase', () => {
        describe('throws', () => {
            it('an error if the data cannot be written back.', async () => {
                const data: Database = {
                    cars: [],
                    users: [],
                    auth: []
                };

                await expect(writeDatabase(data)).rejects.toThrow();
            });
        });
    });
});

