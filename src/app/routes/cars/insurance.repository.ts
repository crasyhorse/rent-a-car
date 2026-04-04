import type { Database } from '@/db/database.model';
import { readDatabase } from '@/db/db';
import type { Insurance } from '@/db/insurance.model';
import jsonata from 'jsonata';

const getInsurances = async (): Promise<Insurance[]> => {
    const data: Database = await readDatabase();

    const expression = jsonata('insurances');
    const insurances = expression.evaluate(data) as Promise<Insurance[]>;

    return insurances;
};

const getInsuranceById = async (
    id: Insurance['id']
): Promise<Insurance | undefined> => {
    const data: Database = await readDatabase();

    const expression = jsonata(`insurances[id="${id}"]`);
    const insurance = expression.evaluate(data) as Promise<
        Insurance | undefined
    >;

    return insurance;
};

export { getInsuranceById, getInsurances };

