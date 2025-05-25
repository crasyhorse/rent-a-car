import { describe, it, expect } from 'vitest';
import { getInsurances, getInsuranceById } from '@/app/routes/cars/insurance.repository';

describe('insurance.repository', () => {
    describe('getInsurances', () => {
        describe('returns', () => {
            it('the list of all insurances.', async () => {
                await expect(getInsurances()).resolves.toMatchSnapshot();
            });
        });
    });

    describe('getInsuranceById', () => {
        describe('returns', () => {
            it(`the insurance identified by '8164aff9-4621-4c9b-a882-b95d54547c0f'`, async () => {
                const insuranceId = '8164aff9-4621-4c9b-a882-b95d54547c0f';
                await expect(getInsuranceById(insuranceId)).resolves.toMatchSnapshot();
            });

            it('undefined if the insurance does not exist.', async () => {
                const nonExistingInsuranceId = '3f9d49ac-4711-0815-6666-f7b58cb08d37';

                await expect(
                    getInsuranceById(nonExistingInsuranceId)
                ).resolves.toBeUndefined();
            });
        });
    });
});
