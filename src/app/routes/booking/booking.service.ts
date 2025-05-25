import { BookingDataInput } from '@/db/booking-data-input.model';
import { BookingData } from '@/db/BookingData';
import { Car } from '@/db/car.model';
import { getBookingsByCarId } from '@/app/routes/booking/booking.repositroy';
import { areIntervalsOverlapping } from 'date-fns';
import HttpException from '@/app/models/HttpException';

const executeBooking = async (
    bookingData: BookingDataInput
): Promise<BookingData | never> => {
    const { startDate, endDate } = bookingData;

    if (await carIsAlreadyBooked(bookingData.car, startDate, endDate)) {
        throw new HttpException(
            403,
            'This car has alread been booked in this period!'
        );
    }

    return {};
};

const carIsAlreadyBooked = async (
    car: Car,
    startDate: Date,
    endDate: Date
): Promise<boolean> => {
    const carId = car.id;

    const bookings = await getBookingsByCarId(carId);

    const isBooked = bookings.some((booking) =>
        areIntervalsOverlapping(
            {
                start: startDate,
                end: endDate
            },
            {
                start: new Date(booking.startDate),
                end: new Date(booking.endDate)
            }
        )
    );

    return isBooked;
};
export { executeBooking };

