import { BookingDataInput } from '@/db/booking-data-input.model';
import { BookingData } from '@/db/booking-data';
import { Car } from '@/db/car.model';
import { Insurance } from '@/db/insurance.model';
import { Option } from '@/db/option.model';
import { getBookingsByCarId } from '@/app/routes/booking/booking.repositroy';
import HttpException from '@/app/models/HttpException';
import { createBooking } from '@/app/routes/booking/booking.repositroy';
import { getUserById } from '@/app/routes/auth/auth.repository';
import { getCarById } from '@/app/routes/cars/car.repository';
import { getInsuranceById } from '../cars/insurance.repository';
import { getOptionById } from '../cars/opiton.repository';
import { areIntervalsOverlapping } from 'date-fns';
import { intervalToDuration } from 'date-fns';

const executeBooking = async (
    bookingInput: BookingDataInput
): Promise<BookingData | never> => {
    const startDate = new Date(bookingInput.startDate);
    const endDate = new Date(bookingInput.endDate);

    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
        throw new HttpException(422, 'Start date or end date is invalid.');
    }

    if (startDate >= endDate) {
        throw new HttpException(422, 'Start date must be before end date.');
    }

    if (await carIsAlreadyBooked(bookingInput.carId, startDate, endDate)) {
        throw new HttpException(
            403,
            'This car has already been booked in this period!'
        );
    }

    const user = await getUserById(bookingInput.userId);
    if (!user) {
        throw new HttpException(
            422,
            'Wrong user id. The user could not be found.'
        );
    }

    const car = await getCarById(bookingInput.carId);
    if (!car) {
        throw new HttpException(
            422,
            'Wrong car id. The car could not be found.'
        );
    }

    const insurance = await getInsuranceById(bookingInput.insuranceId);
    if (!insurance) {
        throw new HttpException(
            422,
            'Wrong insurance id. The insurance could not be found.'
        );
    }

    const option = await getOptionById(bookingInput.optionId);
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
    const days = intervalToDuration({
        start: startDate,
        end: endDate
    }).days;

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

