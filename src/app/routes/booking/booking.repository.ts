import HttpException from '@/app/models/HttpException';
import { BookingDataRecord } from '@/db/booking-data-record';
import type { Database } from '@/db/database.model';
import { readDatabase, writeDatabase } from '@/db/db';
import jsonata from 'jsonata';

const getBookingsByCarId = async (
    carId: string
): Promise<BookingDataRecord[]> => {
    const data: Database = await readDatabase();

    const expression = jsonata(`bookings[carId="${carId}"][]`);
    const bookings = (await expression.evaluate(data)) as
        | BookingDataRecord[]
        | undefined;

    return bookings ?? [];
};

const getBookingById = async (
    bookingId: string
): Promise<BookingDataRecord | undefined> => {
    const data: Database = await readDatabase();

    const expression = jsonata(`bookings[id="${bookingId}"]`);
    const booking = (await expression.evaluate(data)) as
        | BookingDataRecord
        | undefined;

    return booking;
};

const createBooking = async (bookingData: BookingDataRecord): Promise<void> => {
    const data: Database = await readDatabase();

    const alreadyExists = data.bookings.some(
        (booking) => booking.id === bookingData.id
    );

    if (alreadyExists) {
        throw new HttpException(409, 'Booking id already exists.');
    }

    data.bookings.push(bookingData);

    await writeDatabase(data);
};

const deleteBookingById = async (bookingId: string): Promise<void> => {
    const data: Database = await readDatabase();

    const idx = data.bookings.findIndex((booking) => booking.id === bookingId);

    if (idx === -1) {
        throw new HttpException(404, 'Booking could not be found.');
    }

    data.bookings.splice(idx, 1);

    await writeDatabase(data);
};

export { createBooking, deleteBookingById, getBookingById, getBookingsByCarId };
