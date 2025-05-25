import { describe, it, expect } from 'vitest';
import { getBookingsByCarId } from '@/app/routes/booking/booking.repositroy';

describe('car.repository', () => {
    describe('getBookingsByCarId', () => {
        describe('returns', () => {
            it('an array with booking records for the given carId.', async () => {
                const carId = '4ec570ea-3afd-4fad-af60-dad23d4c7d37';

                await expect(
                    getBookingsByCarId(carId)
                ).resolves.toMatchSnapshot();
            });
        });
    });
});

