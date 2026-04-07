import { Car } from '@/db/car.model';
import { Insurance } from '@/db/insurance.model';
import { Option } from '@/db/option.model';
import { User } from '@/db/user.model';

export interface BookingDataInput {
    customerId: User['id'];
    carId: Car['id'];
    startDate: string;
    endDate: string;
    insuranceId: Insurance['id'];
    optionId: Option['id'];
}

export type RawBookingDataInput = Partial<BookingDataInput>;

export interface BookingDataRecord extends BookingDataInput {
    id: string;
    price: number;
}
