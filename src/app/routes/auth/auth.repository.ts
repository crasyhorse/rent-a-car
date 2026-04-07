import HttpException from '@/app/models/HttpException';
import { RegisterInput } from '@/db/register-input.model';
import { AuthData } from '@/db/auth-data.model';
import type { Database } from '@/db/database.model';
import { readDatabase, writeDatabase } from '@/db/db';
import { User } from '@/db/user.model';
import * as bcrypt from 'bcryptjs';
import jsonata from 'jsonata';
import { randomUUID } from 'node:crypto';

const createAuthData = async (user: User, password: string): Promise<void> => {
    const data: Database = await readDatabase();

    const authData: AuthData = {
        id: user.id,
        password: await bcrypt.hash(password, 10)
    };

    data.auth.push(authData);

    await writeDatabase(data);
};

const getEntity = async <T>(jsonataString: string): Promise<T | undefined> => {
    const data: Database = await readDatabase();
    const expression = jsonata(jsonataString);
    const entity = (await expression.evaluate(data)) as T | undefined;

    return entity;
};

const getUserByEmail = async (email: string): Promise<User | undefined> => {
    return getEntity<User>(`users[email="${email}"]`);
};

const getUserById = async (userId: User['id']): Promise<User | undefined> => {
    return getEntity<User>(`users[id="${userId}"]`);
};

const getPasswordById = async (userId: string): Promise<string | undefined> => {
    return getEntity<string>(`auth[id="${userId}"].password`);
};

const mergeUser = async (user: User | RegisterInput): Promise<User> => {
    const data: Database = await readDatabase();
    let mergedUser: User;

    if ('id' in user) {
        const idx = await findUser(data, user);
        mergedUser = await updateUser(user);
        data.users[idx] = mergedUser;
    } else {
        mergedUser = createUser(user);
        data.users.push(mergedUser);
    }

    await writeDatabase(data);

    return mergedUser;
};

const userExists = async (
    email: string
): Promise<(user: User) => user is User> => {
    const _user = await getUserByEmail(email);

    return (user: User): user is User => user === _user;
};

const createUser = (user: RegisterInput): User => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const userWithoutPassword = (({ password, ...rest }) => rest)(user);

    return {
        ...userWithoutPassword,
        id: randomUUID()
    };
};

const findUser = async (data: Database, user: User): Promise<number> => {
    const idx = data.users.findIndex((u: User) => u.id === user.id);

    if (idx === -1) {
        throw new HttpException(
            422,
            'A problem occured when you tried to update this user.'
        );
    }

    return idx;
};

const updateUser = async (user: User): Promise<User> => {
    const originalUser = await getUserById(user.id);

    if (!originalUser) {
        throw new HttpException(
            422,
            'A problem occured when you tried to update this user.'
        );
    }

    return {
        ...originalUser,
        ...user,
        id: originalUser.id
    };
};

export {
    createAuthData,
    getPasswordById,
    getUserByEmail,
    getUserById,
    mergeUser,
    userExists as userIsUnique
};

