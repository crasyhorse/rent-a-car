import { describe, it, expect } from 'vitest';
import {
    listCars,
    getCar,
    listInsurances,
    listOptions
} from '@/app/routes/cars/car.service';
import HttpException from '@/app/models/HttpException';

describe('car.service', () => {
    describe('getCar', () => {
        describe('returns', () => {
            it('a car identified by a given id.', async () => {
                const carId = '2e9d49ac-ec6f-41e5-b04a-f7b58cb08d37';

                await expect(getCar(carId)).resolves.toMatchSnapshot();
            });
        });

        describe('throws', () => {
            it('an HTTP 404 if the car does not exist.', async () => {
                const nonExistingCarId = '2e9d49ac-4711-0815-b666-f7b58cb08d37';
                const expected404Error = new HttpException(
                    404,
                    `Could not find the car identified by ${nonExistingCarId}!`
                );

                await expect(getCar(nonExistingCarId)).rejects.toThrowError(
                    expected404Error
                );
            });
        });
    });

    describe('listCars', () => {
        describe('returns', () => {
            it('a list of all cars.', async () => {
                await expect(listCars()).resolves.toMatchSnapshot();
            });
        });
    });

    describe('listInsurances', () => {
        describe('returns', () => {
            it('a list of available insurances.', async () => {
                await expect(listInsurances()).resolves.toMatchSnapshot();
            });
        });
    });

    describe('listOptions', () => {
        describe('returns', () => {
            it('a list of available options.', async () => {
                await expect(listOptions()).resolves.toMatchSnapshot();
            });
        });
    });
});

