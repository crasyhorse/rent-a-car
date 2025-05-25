import { User } from '@/db/user.model';
import { AuthData } from '@/db/auth-data.model';
import { Insurance } from '@/db/insurance.model';
import { Option } from '@/db/option.model';
import { BookingDataRecord } from './booking-data-record';

export interface Database {
    cars: [];
    users: User[];
    auth: AuthData[];
    bookings: BookingDataRecord[];
    insurance: Insurance[],
    options: Option[];
}