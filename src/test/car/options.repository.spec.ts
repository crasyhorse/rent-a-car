import { describe, it, expect } from 'vitest';
import { getOptions } from '@/app/routes/cars/opiton.repository';

describe('opiton.repository', () => {
    describe('getOptions', () => {
        describe('returns', () => {
            it('the list of all options.', async () => {
                await expect(getOptions()).resolves.toMatchSnapshot();
            });
        });
    });
});
