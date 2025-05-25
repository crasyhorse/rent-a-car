import { readDatabase, writeDatabase } from '@/db/db';
import jsonata from 'jsonata';
import type { Database } from '@/db/database.model';
import { BookingData } from '@/db/booking-data';
import { BookingDataRecord } from '@/db/booking-data-record';

const getBookingsByCarId = async (carId: string): Promise<BookingData[]> => {
    const data: Database = await readDatabase();

    const expression = jsonata(`$append(bookings[carId="${carId}"], [])`);
    const bookings: Promise<BookingData[]> = expression.evaluate(data);

    return bookings;
};

const createBooking = async (bookingData: BookingDataRecord): Promise<void> => {
    const data: Database = await readDatabase();

    data.bookings.push(bookingData);

    await writeDatabase(data);
};

export { createBooking, getBookingsByCarId };

