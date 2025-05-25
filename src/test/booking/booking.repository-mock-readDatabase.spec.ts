import getEmptyBookingsDatabase from '@/test/booking/emptyBookings.db';
import { describe, it, expect, vi, afterAll } from 'vitest';

vi.mock('@/db/db', async () => {
    return {
        readDatabase: vi.fn().mockResolvedValue(getEmptyBookingsDatabase())
    };
});

import { getBookingsByCarId } from '@/app/routes/booking/booking.repositroy';

describe('booking.repository', () => {
    afterAll(() => {
        vi.restoreAllMocks();
    });
    describe('getBookingsByCarId', () => {
        describe('returns', () => {
            it('an empty array if there are no bookings for a given car in the database.', async () => {
                const carId = '4ec570ea-3afd-4fad-af60-dad23d4c7d37';
                await expect(getBookingsByCarId(carId)).resolves.toEqual([]);
            });
        });
    });
});

