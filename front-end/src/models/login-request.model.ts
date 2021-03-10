export class LoginRequest {
    constructor(partial: Partial<LoginRequest> = {}) {
        this.email = '';
        this.password = '';
        Object.assign(this, partial);
    }

    public email: string;
    public password: string;
}