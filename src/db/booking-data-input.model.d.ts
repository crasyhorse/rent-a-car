import { Car } from '@/db/car.model';
import { Insurance } from '@/db/insurance.model';
import { Option } from '@/db/option.model';
import { User } from '@/db/user.model';

export interface BookingDataInput {
    user: User;
    car: Car;
    startDate: Date;
    endDate: Date;
    insurance: Insurance;
    option: Option;
}
