import { User } from './models/user-db.model';
import { Repositories } from './repositories.enum';

export const usersDbProvider = [
    {
        provide: Repositories.USERS_REPOSITORY,
        useValue: User,
    },
];