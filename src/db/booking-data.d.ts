import { User } from '@/db/user.model';
import { Car } from '@/db/car.model';
import { Insurance } from '@/db/insurance.model';
import { Option } from '@/db/option.model';

export interface BookingData {
    user: User;
    car: Car;
    startDate: Date;
    endDate: Date;
    insurance: Insurance;
    option: Option;
    price: string;
}
