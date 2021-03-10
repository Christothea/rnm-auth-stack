export class User {

    constructor(partial: Partial<User> = {}) {
        this.fullName = '';
        this.email = '';
        Object.assign(this, partial);
    }

    public fullName: string;
    public email: string;
}