import type { Database } from '@/db/database.model';
import { readDatabase } from '@/db/db';
import type { Insurance } from '@/db/insurance.model';
import jsonata from 'jsonata';

const getInsurances = async (): Promise<Insurance[] | undefined> => {
    const data: Database = await readDatabase();

    const expression = jsonata('insurances');
    const insurances: Promise<Insurance[] | undefined> =
        expression.evaluate(data);

    return insurances;
};

const getInsuranceById = async (
    id: Insurance['id']
): Promise<Insurance | undefined> => {
    const data: Database = await readDatabase();

    const expression = jsonata(`insurances[id="${id}"]`);
    const insurance: Promise<Insurance | undefined> =
        expression.evaluate(data);

    return insurance;
};

export { getInsuranceById, getInsurances };

