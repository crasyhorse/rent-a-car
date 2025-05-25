import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath, URL } from 'node:url';
import type { Database } from '@/db/database.model';

const readDatabase = async (): Promise<Database | never> => {
    let data: Database;

    const filename = fileURLToPath(
        new URL(process.env.VITE_DATABASE_FILE as string, import.meta.url)
    );

    try {
        data = JSON.parse(await readFile(filename, 'utf8'));
    } catch (err) {
        throw new Error(`Error reading JSON file: ${err}`);
    }

    return data;
};

const writeDatabase = async (data: Database): Promise<void> => {
    const filename = fileURLToPath(
        new URL(process.env.VITE_DATABASE_FILE as string, import.meta.url)
    );

    try {
        await writeFile(filename, JSON.stringify(data));
    } catch (err) {
        throw new Error(`Error writting data back to JSON file: ${err}`);
    }
};

export { readDatabase, writeDatabase };

