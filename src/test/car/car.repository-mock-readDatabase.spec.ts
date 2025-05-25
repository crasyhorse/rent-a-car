import getEmptyCarDatabase from '@/test/car/emptyCars.db';
import { describe, it, expect, vi, afterAll } from 'vitest';

vi.mock('@/db/db', async () => {
    return {
        readDatabase: vi.fn().mockResolvedValue(getEmptyCarDatabase())
    };
});

import { getCars } from '@/app/routes/cars/car.repository';

describe('car.repository', () => {
    afterAll(() => {
        vi.restoreAllMocks();
    });

    describe('getCars', () => {
        describe('returns', () => {
            it('an empty array if there are no cars in the database.', async () => {
                await expect(getCars()).resolves.toEqual([]);
            });
        });
    });
});

