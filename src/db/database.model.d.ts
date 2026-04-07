import { AuthData } from '@/db/auth-data.model';
import { Insurance } from '@/db/insurance.model';
import { Option } from '@/db/option.model';
import { User } from '@/db/user.model';
import { BookingDataRecord } from './booking-data-input.model';

export interface Database {
    cars: [];
    users: User[];
    auth: AuthData[];
    bookings: BookingDataRecord[];
    insurance: Insurance[];
    options: Option[];
}
