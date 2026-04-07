import { Car } from '@/db/car.model';
import { Insurance } from '@/db/insurance.model';
import { Option } from '@/db/option.model';
import { User } from '@/db/user.model';

export interface BookingData {
    id: string;
    user: User;
    car: Car;
    startDate: string;
    endDate: string;
    insurance: Insurance;
    option: Option;
    price: string;
}
