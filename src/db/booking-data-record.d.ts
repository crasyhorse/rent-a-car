import { BookingDataInput } from '@/db/booking-data-input.model';

interface BookingDataRecord extends BookingDataInput {
    price: number;
}
