import { describe, it, expect } from 'vitest';
import { getOptionById, getOptions } from '@/app/routes/cars/opiton.repository';

describe('opiton.repository', () => {
    describe('getOptions', () => {
        describe('returns', () => {
            it('the list of all options.', async () => {
                await expect(getOptions()).resolves.toMatchSnapshot();
            });
        });
    });

    describe('getOptionById', () => {
        describe('returns', () => {
            it(`the option identified by '13744176-67c5-4f9e-bf01-204dd95ba3e5'`, async () => {
                const insuranceId = '13744176-67c5-4f9e-bf01-204dd95ba3e5';
                await expect(
                    getOptionById(insuranceId)
                ).resolves.toMatchSnapshot();
            });

            it('undefined if the option does not exist.', async () => {
                const nonExistingInsuranceId =
                    '3f9d49ac-4711-0815-6666-f7b58cb08d37';

                await expect(
                    getOptionById(nonExistingInsuranceId)
                ).resolves.toBeUndefined();
            });
        });
    });
});

