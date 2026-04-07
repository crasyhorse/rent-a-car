import type { BookingDataRecord } from '@/db/booking-data-input.model';
import { readDatabase } from '@/db/db';

const getBooking = async (
    customerId: string,
    carId: string,
    startDate: string,
    endDate: string
): Promise<BookingDataRecord | undefined> => {
    const data = await readDatabase();

    const normalizedStartDate = new Date(startDate).toISOString();
    const normalizedEndDate = new Date(endDate).toISOString();

    return data.bookings.find(
        (booking) =>
            booking.customerId === customerId &&
            booking.carId === carId &&
            new Date(booking.startDate).toISOString() === normalizedStartDate &&
            new Date(booking.endDate).toISOString() === normalizedEndDate
    );
};

export { getBooking };

