import { readDatabase } from '@/db/db';
import jsonata from 'jsonata';
import type { Database } from '@/db/database.model';
import type { Option } from '@/db/option.model';

const getOptions = async (): Promise<Option[] | undefined> => {
    const data: Database = await readDatabase();

    const expression = jsonata('options');
    const options: Promise<Option[] | undefined> =
        expression.evaluate(data);

    return options;
};

export { getOptions };
