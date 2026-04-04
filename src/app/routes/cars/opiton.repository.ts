import type { Database } from '@/db/database.model';
import { readDatabase } from '@/db/db';
import type { Option } from '@/db/option.model';
import jsonata from 'jsonata';

const getOptions = async (): Promise<Option[] | undefined> => {
    const data: Database = await readDatabase();

    const expression = jsonata('options');
    const options = expression.evaluate(data) as Promise<Option[]>;

    return options;
};

const getOptionById = async (id: Option['id']): Promise<Option | undefined> => {
    const data: Database = await readDatabase();

    const expression = jsonata(`options[id="${id}"]`);
    const insurance = expression.evaluate(data) as Promise<Option | undefined>;

    return insurance;
};

export { getOptionById, getOptions };

