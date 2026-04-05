import HttpException from '@/app/models/HttpException';
import type { Database } from '@/db/database.model';
import { readDatabase, writeDatabase } from '@/db/db';
import type { UserProfile } from '@/db/user-profile.model';

const getUserProfileById = async (
    userId: string
): Promise<UserProfile | undefined> => {
    const data = await readDatabase();
    const user = data.users.find((storedUser) => storedUser.id === userId);

    return user?.profile;
};

const upsertUserProfile = async (
    userId: string,
    profile: UserProfile
): Promise<UserProfile> => {
    const data: Database = await readDatabase();
    const userIndex = data.users.findIndex(
        (storedUser) => storedUser.id === userId
    );

    if (userIndex === -1) {
        throw new HttpException(404, 'User not found.');
    }

    data.users[userIndex].profile = profile;
    await writeDatabase(data);

    return profile;
};

export { getUserProfileById, upsertUserProfile };
