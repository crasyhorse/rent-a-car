import { Car } from '@/db/car.model';
import { Insurance } from '@/db/insurance.model';
import { Option } from '@/db/option.model';
import { User } from '@/db/user.model';

export interface BookingDataInput {
    userId: User['id'];
    carId: Car['id'];
    startDate: Date;
    endDate: Date;
    insuranceId: Insurance['id'];
    optionId: Option['id'];
}