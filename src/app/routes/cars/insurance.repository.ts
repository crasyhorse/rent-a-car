import { readDatabase } from '@/db/db';
import jsonata from 'jsonata';
import type { Database } from '@/db/database.model';
import type { Insurance } from '@/db/insurance.model';

const getInsurances = async (): Promise<Insurance[] | undefined> => {
    const data: Database = await readDatabase();

    const expression = jsonata('insurance');
    const insurances: Promise<Insurance[] | undefined> =
        expression.evaluate(data);

    return insurances;
};

export { getInsurances };
