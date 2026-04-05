import { BookingDataInput } from '@/db/booking-data-input.model';

export interface BookingDataRecord extends BookingDataInput {
    id: string;
    price: number;
}