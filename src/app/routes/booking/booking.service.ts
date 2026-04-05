import HttpException from '@/app/models/HttpException';
import { getUserById } from '@/app/routes/auth/auth.repository';
import {
    createBooking,
    deleteBookingById,
    getBookingById,
    getBookingsByCarId
} from '@/app/routes/booking/booking.repository';
import { getCarById } from '@/app/routes/cars/car.repository';
import { getInsuranceById } from '@/app/routes/cars/insurance.repository';
import { getOptionById } from '@/app/routes/cars/option.repository';
import { BookingData } from '@/db/booking-data';
import {
    BookingDataInput,
    RawBookingDataInput
} from '@/db/booking-data-input.model';
import { BookingDataRecord } from '@/db/booking-data-record';
import { Car } from '@/db/car.model';
import { Insurance } from '@/db/insurance.model';
import { Option } from '@/db/option.model';
import { areIntervalsOverlapping, differenceInCalendarDays } from 'date-fns';
import { randomUUID } from 'node:crypto';

const executeBooking = async (
    bookingInput: RawBookingDataInput
): Promise<BookingData> => {
    const normalizedInput: BookingDataInput = {
        userId: bookingInput.userId?.trim() ?? '',
        carId: bookingInput.carId?.trim() ?? '',
        insuranceId: bookingInput.insuranceId?.trim() ?? '',
        optionId: bookingInput.optionId?.trim() ?? '',
        startDate: bookingInput.startDate?.trim() ?? '',
        endDate: bookingInput.endDate?.trim() ?? ''
    };

    const { startDate, endDate } = validateDates(normalizedInput);

    const conflictingBooking = await getConflictingBooking(
        normalizedInput.carId,
        startDate,
        endDate
    );

    if (conflictingBooking) {
        if (conflictingBooking.userId !== normalizedInput.userId) {
            throw new HttpException(
                409,
                'This car has already been booked by another user in this period.'
            );
        }

        throw new HttpException(
            403,
            'This car has already been booked in this period!'
        );
    }

    const [user, car, insurance, option] = await Promise.all([
        getUserById(normalizedInput.userId),
        getCarById(normalizedInput.carId),
        getInsuranceById(normalizedInput.insuranceId),
        getOptionById(normalizedInput.optionId)
    ]);

    if (!user) {
        throw new HttpException(
            422,
            'Wrong user id. The user could not be found.'
        );
    }

    if (!car) {
        throw new HttpException(
            422,
            'Wrong car id. The car could not be found.'
        );
    }

    if (!insurance) {
        throw new HttpException(
            422,
            'Wrong insurance id. The insurance could not be found.'
        );
    }

    if (!option) {
        throw new HttpException(
            422,
            'Wrong option id. The option could not be found.'
        );
    }

    const price = calculatePrice(startDate, endDate, car, insurance, option);

    if (price === null) {
        throw new HttpException(
            422,
            'Could not calculate price. The booking data seems to be wrong.'
        );
    }

    const bookingRecord: BookingDataRecord = {
        id: randomUUID(),
        ...normalizedInput,
        price
    };

    await createBooking(bookingRecord);

    return {
        id: bookingRecord.id,
        user,
        car,
        startDate: normalizedInput.startDate,
        endDate: normalizedInput.endDate,
        insurance,
        option,
        price: price.toFixed(2)
    };
};

const calculatePrice = (
    startDate: Date,
    endDate: Date,
    car: Car,
    insurance: Insurance,
    option: Option
): number | null => {
    const days = differenceInCalendarDays(endDate, startDate);

    if (days <= 0) {
        return null;
    }

    return days * car.dailyRate + insurance.price + option.price;
};

const cancelBooking = async (
    bookingId: string,
    userId: string
): Promise<void> => {
    const normalizedBookingId = bookingId.trim();
    const normalizedUserId = userId.trim();

    if (!normalizedBookingId) {
        throw new HttpException(422, 'Booking id cannot be blank.');
    }

    if (!normalizedUserId) {
        throw new HttpException(422, 'User id cannot be blank.');
    }

    const booking = await getBookingById(normalizedBookingId);

    if (!booking) {
        throw new HttpException(404, 'Booking could not be found.');
    }

    if (booking.userId !== normalizedUserId) {
        throw new HttpException(
            403,
            'Forbidden. You can only cancel your own bookings.'
        );
    }

    await deleteBookingById(normalizedBookingId);
};

const getConflictingBooking = async (
    carId: Car['id'],
    startDate: Date,
    endDate: Date
): Promise<BookingDataRecord | undefined> => {
    const bookings = await getBookingsByCarId(carId);

    return bookings.find((booking) =>
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
