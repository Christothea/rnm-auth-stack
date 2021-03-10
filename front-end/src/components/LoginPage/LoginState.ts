import { ApiResponse } from '../../models/api-response';
import { LoginRequest } from '../../models/login-request.model';

export class LoginState extends LoginRequest {
    constructor(partial: Partial<LoginState> = {}) {
        super(partial);
        this.submitResponse = new ApiResponse();
        this.validationErrors = {
            email: '',
            password: ''
        };
        Object.assign(this, partial);
    }

    public validationErrors: {
        [key in keyof Omit<LoginState, 'validationErrors' | 'submitResponse'>]: string;
    };

    public submitResponse: ApiResponse;
}