import { User } from '@/db/user.model';
import { Car } from '@/db/car.model';
import { Insurance } from '@/db/insurance.model';
import { Option } from '@/db/option.model';

export interface BookingData {
    userId: User['id'];
    carId: Car['id'];
    startDate: string;
    endDate: string;
    insuranceId: Insurance['id'];
    optionId: Option['id'];
    price: number;
}

