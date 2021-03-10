import { AccessToken } from './access-token.model';
import { User } from './user.model';

export class UserProfile {
    constructor(partial: Partial<UserProfile> = {}) {
        this.accessToken = new AccessToken();
        this.info = new User();
        this.isLoggedIn = false;
        this.userStateChanged = (userProfile: UserProfile) => { };
        Object.assign(this, partial);
    }

    public accessToken: AccessToken;
    public info: User;
    public isLoggedIn: boolean;

    public userStateChanged: (userProfile: UserProfile) => void;
}