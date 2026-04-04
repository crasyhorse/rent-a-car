import HttpException from '@/app/models/HttpException';
import { getCarById, getCars } from '@/app/routes/cars/car.repository';
import { getInsurances } from '@/app/routes/cars/insurance.repository';
import { getOptions } from '@/app/routes/cars/opiton.repository';

const getCar = async (id: string) => {
    const car = await getCarById(id);

    if (!car) {
        throw new HttpException(
            404,
            `Could not find the car identified by ${id}!`
        );
    }

    return car;
};

const listCars = async () => {
    const cars = await getCars();

    if (!cars || cars?.length === 0) {
        throw new HttpException(404, 'Could not find any car in the system!');
    }

    return cars;
};

const listInsurances = async () => {
    const insurances = await getInsurances();

    if (!insurances || insurances?.length === 0) {
        throw new HttpException(404, 'No insurances could be found!');
    }

    return insurances;
};

const listOptions = async () => {
    const options = await getOptions();

    if (!options || options?.length === 0) {
        throw new HttpException(404, 'Could not find any bookable options!');
    }

    return options;
};

export { listCars, getCar, listInsurances, listOptions };

