import { readDatabase } from '@/db/db';
import jsonata from 'jsonata';
import type { Database } from '@/db/database.model';
import type { Car } from '@/db/car.model';

const getCarById = async (id: Car["id"]): Promise<Car | undefined> => {
    const data: Database = await readDatabase();

    const expression = jsonata(`cars[id="${id}"]`);
    const car: Promise<Car | undefined> = expression.evaluate(data);

    return car;
};

const getCars = async (): Promise<Car[] | undefined> => {
    const data: Database = await readDatabase();

    const expression = jsonata('cars');
    const cars: Promise<Car[] | undefined> = expression.evaluate(data);

    return cars;
};

export { getCarById, getCars };

