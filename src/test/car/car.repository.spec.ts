import { describe, it, expect, vi, afterEach } from 'vitest';
import { getCarById, getCars } from '@/app/routes/cars/car.repository';

describe('car.repository', () => {
    describe('getCarById', () => {
        describe('returns', () => {
            it(`the car identified by '2e9d49ac-ec6f-41e5-b04a-f7b58cb08d37'`, async () => {
                const carId = '2e9d49ac-ec6f-41e5-b04a-f7b58cb08d37';
                await expect(getCarById(carId)).resolves.toMatchSnapshot();
            });

            it('undefined if the car does not exist.', async () => {
                const nonExistingCarId = '3f9d49ac-4711-0815-6666-f7b58cb08d37';

                await expect(
                    getCarById(nonExistingCarId)
                ).resolves.toBeUndefined();
            });
        });
    });

    describe('getCars', () => {
        describe('returns', () => {
            it('a list of cars.', async () => {
                await expect(getCars()).resolves.toMatchSnapshot();
            });
        });
    });
});

