import type { Car } from '@/db/car.model';
import type { Database } from '@/db/database.model';
import { readDatabase } from '@/db/db';
import jsonata from 'jsonata';

const getCarById = async (id: Car['id']): Promise<Car | undefined> => {
    const data: Database = await readDatabase();

    const expression = jsonata(`cars[id="${id}"]`);
    const car = expression.evaluate(data) as Promise<Car | undefined>;

    return car;
};

const getCars = async (): Promise<Car[]> => {
    const data: Database = await readDatabase();

    const expression = jsonata('cars');
    const cars = expression.evaluate(data) as Promise<Car[]>;

    return cars;
};

export { getCarById, getCars };

