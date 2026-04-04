import HttpException from '@/app/models/HttpException';
import { AuthData } from '@/db/auth-data.model';
import type { Database } from '@/db/database.model';
import { readDatabase, writeDatabase } from '@/db/db';
import { User } from '@/db/user.model';
import * as bcrypt from 'bcryptjs';
import jsonata from 'jsonata';
import { randomUUID } from 'node:crypto';
import { RegisterInput } from './register-input.model';

const createAuthData = async (user: User, password: string): Promise<void> => {
    const data: Database = await readDatabase();

    const authData: AuthData = {
        id: user.id,
        password: await bcrypt.hash(password, 10)
    };

    data.auth.push(authData);

    await writeDatabase(data);
};

const getEntity = async <T extends User | string>(
    jsonataString: string
): Promise<T | undefined> => {
    const data: Database = await readDatabase();
    const expression = jsonata(jsonataString);
    const entity: Promise<T | undefined> = expression.evaluate(data);

    return entity;
};

const getUserByEmail = async (email: string): Promise<User | undefined> => {
    return getEntity(`users[email="${email}"]`);
};

const getUserById = async (userId: User['id']): Promise<User | undefined> => {
    return getEntity(`users[id="${userId}"]`);
};

const getPasswordById = async (userId: string): Promise<string | undefined> => {
    return getEntity(`auth[id="${userId}"].password`);
};

const mergeUser = async (user: User | RegisterInput): Promise<User> => {
    const data: Database = await readDatabase();
    let mergedUser: User;

    if (Object.hasOwn(user, 'id')) {
        const _user: User = { ...user } as User;
        const i = await findUser(data, _user);

        mergedUser = await updateUser(_user);
        data.users[i] = { ...user, ...mergedUser };
    } else {
        const _user: RegisterInput = { ...user } as RegisterInput;

        mergedUser = createUser(_user);
        data.users.push(mergedUser);
    }

    await writeDatabase(data);

    return mergedUser;
};

const userIsUnique = async (email: string): Promise<boolean> => {
    return (await getUserByEmail(email)) === undefined;
};

const createUser = (user: RegisterInput): User => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _user = (({ password, ...userWithoutPassword }) =>
        userWithoutPassword)(user);

    return { ..._user, id: randomUUID() };
};

const findUser = async (
    data: Database,
    user: User
): Promise<number | never> => {
    const i = data.users.findIndex((u: User) => u.id === user.id);

    if (i === -1) {
        throw new HttpException(
            422,
            'A problem occured when you tried to update this user.'
        );
    }

    return i;
};

const updateUser = async (user: User): Promise<User> => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _user = (({ id, email, ...clone }) => clone)(user);
    const originalUser = await getUserByEmail(user.email);

    if (!originalUser) {
        throw new HttpException(
            422,
            'A problem occured when you tried to update this user.'
        );
    }

    const updatedUser = { ...originalUser, ..._user };

    return updatedUser;
};

export {
    createAuthData,
    getUserByEmail,
    getUserById,
    getPasswordById,
    mergeUser,
    userIsUnique
};

