export class AccessToken {
    constructor(partial: Partial<AccessToken> = {}) {
        this.expiresInHours = 0;
        this.token = '';
        Object.assign(this, partial);
    }

    /**
     * @description Number of hours after which the token will expire
     */
    public expiresInHours: number;
    public token: string;
}