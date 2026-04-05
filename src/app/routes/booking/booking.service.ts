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
    const userId = bookingInput.userId?.trim();
    const carId = bookingInput.carId?.trim();
    const insuranceId = bookingInput.insuranceId?.trim();
    const optionId = bookingInput.optionId?.trim();
    const startDateRaw = bookingInput.startDate?.trim();
    const endDateRaw = bookingInput.endDate?.trim();

    if (!userId) {
        throw new HttpException(422, 'User id cannot be blank.');
    }

    if (!carId) {
        throw new HttpException(422, 'Car id cannot be blank.');
    }

    if (!insuranceId) {
        throw new HttpException(422, 'Insurance id cannot be blank.');
    }

    if (!optionId) {
        throw new HttpException(422, 'Option id cannot be blank.');
    }

    if (!startDateRaw) {
        throw new HttpException(422, 'Start date cannot be blank.');
    }

    if (!endDateRaw) {
        throw new HttpException(422, 'End date cannot be blank.');
    }

    const normalizedInput: BookingDataInput = {
        userId,
        carId,
        insuranceId,
        optionId,
        startDate: startDateRaw,
        endDate: endDateRaw
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
    if (!price) {
        throw new HttpException(
            422,
            'Could not calculate price. The booking data seams to be wrong.'
        );
    }

    const bookingData: BookingData = {
        user,
        car,
        startDate,
        endDate,
        insurance,
        option,
        price: price.toFixed(2)
    };

    await createBooking({ ...bookingInput, price: price });

    return bookingData;
};

const calculatePrice = (
    startDate: Date,
    endDate: Date,
    car: Car,
    insurance: Insurance,
    option: Option
): number | null => {
    const duration = intervalToDuration({
        start: startDate,
        end: endDate
    });
    const days = duration.days ?? 0;

    if (!days) {
        return null;
    }

    return days * car.dailyRate + insurance.price + option.price;
};

// TODO
const cancleBooking = () => {

}

const carIsAlreadyBooked = async (
    carId: Car['id'],
    startDate: Date,
    endDate: Date
): Promise<boolean> => {
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
