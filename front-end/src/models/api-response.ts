export class ApiResponse {
    constructor(partial: Partial<ApiResponse> = {}) {
        this.isSuccessful = false;
        this.message = '';
        Object.assign(this, partial);
    }

    public isSuccessful: boolean;
    public message: string;
}