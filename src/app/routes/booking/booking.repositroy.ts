import { readDatabase } from '@/db/db';
import jsonata from 'jsonata';
import type { Database } from '@/db/database.model';
import { BookingData } from '@/db/BookingData';

const getBookingsByCarId = async (carId: string): Promise<BookingData[]> => {
    const data: Database = await readDatabase();

    const expression = jsonata(`$append(bookings[carId="${carId}"], [])`);
    const bookings: Promise<BookingData[]> = expression.evaluate(data);

    return bookings;
};

export { getBookingsByCarId };

