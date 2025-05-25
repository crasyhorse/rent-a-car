import { describe, it, expect } from 'vitest';
import { getInsurances } from '@/app/routes/cars/insurance.repository';

describe('insurance.repository', () => {
    describe('getInsurances', () => {
        describe('returns', () => {
            it('the list of all insurances.', async () => {
                await expect(getInsurances()).resolves.toMatchSnapshot();
            });
        });
    });
});
