import { ApiResponse } from '../../models/api-response';
import { RegistrationRequest } from '../../models/registration-request.model';

export class RegistrationState extends RegistrationRequest {
    constructor(partial: Partial<RegistrationState> = {}) {
        super(partial);
        this.submitResponse = new ApiResponse();
        this.validationErrors = {
            fullName: '',
            email: '',
            password: ''
        };
        Object.assign(this, partial);
    }

    public validationErrors: {
        [key in keyof Omit<RegistrationState, 'validationErrors' | 'submitResponse'>]: string;
    };

    public submitResponse: ApiResponse;
}