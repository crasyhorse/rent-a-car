import { describe, it, expect, vi, afterAll } from 'vitest';
import getDatabaseWithMissingKeys from '@/test/car/databaseMissingKeys.db';
import HttpException from '@/app/models/HttpException';

vi.mock('@/db/db', async () => {
    return {
        readDatabase: vi.fn().mockResolvedValue(getDatabaseWithMissingKeys())
    };
});

import {
    listCars,
    listInsurances,
    listOptions
} from '@/app/routes/cars/car.service';

describe('car.service', () => {
    afterAll(() => {
        vi.restoreAllMocks();
    });

    describe('listCars', () => {
        describe('throws an error', () => {
            it('if the "cars" key is missing in the database.', async () => {
                const expected404Error = new HttpException(
                    404,
                    'Could not find any car in the system!'
                );

                await expect(listCars()).rejects.toThrowError(expected404Error);
            });
        });
    });

    describe('listInsurances', () => {
        describe('throws an error', () => {
            it('if the "insurances" key is mising in the database.', async () => {
                const expected404Error = new HttpException(
                    404,
                    'No insurances could be found!'
                );

                await expect(listInsurances()).rejects.toThrowError(
                    expected404Error
                );
            });
        });
    });

    describe('listOptions', () => {
        describe('throws an error', () => {
            it('if the "options" key is missing in the database.', async () => {
                const expected404Error = new HttpException(
                    404,
                    'Could not find any bookable options!'
                );

                await expect(listOptions()).rejects.toThrowError(
                    expected404Error
                );
            });
        });
    });
});
