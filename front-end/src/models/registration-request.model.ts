import { User } from './user.model';

export class RegistrationRequest extends User {
    constructor(partial: Partial<RegistrationRequest> = {}) {
        super(partial);
        this.password = '';
        Object.assign(this, partial);
    }

    public password: string;
}