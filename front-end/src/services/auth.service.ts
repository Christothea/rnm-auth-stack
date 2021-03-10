import { EnvVars } from '../environment/env-vars';
import { ApiResponse } from '../models/api-response';
import { LoginRequest } from '../models/login-request.model';
import { RegistrationRequest } from '../models/registration-request.model';
import { UserProfile } from '../models/user-profile.model';
import { apiErrorResponseParser } from '../utils/api-error-response-parser';

export class AuthenticationService {

    private static readonly BaseUrl: string = EnvVars.AUTH_API_BASE_URL;

    public static async login(loginReq: LoginRequest): Promise<[ApiResponse, UserProfile]> {
        try {
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginReq)
            };
            const response: Response = await fetch(`${this.BaseUrl}/login`, requestOptions);

            if (response.status !== 201) {
                const error: any = await response.json();
                console.log(error);
                return [new ApiResponse({ isSuccessful: false, message: `Login Failed: ${error? apiErrorResponseParser(error): `${response.status}: ${response.statusText}`}!` }), new UserProfile()];
            } else {
                const data: any = await response.json();
                return [new ApiResponse({ isSuccessful: true, message: 'Logged in successfully!' }), new UserProfile({
                    info: data.info,
                    accessToken: data.accessToken,
                    isLoggedIn: true
                })];
            }
        } catch (ex) {
            console.error(ex);
            return [new ApiResponse({ isSuccessful: false, message: `Failed to Login, Please contact support!` }), new UserProfile()];
        }
    }

    public logout() {

    }

    public static async register(regReq: RegistrationRequest): Promise<ApiResponse> {
        try {
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(regReq)
            };
            const response: Response = await fetch(`${this.BaseUrl}/register`, requestOptions);

            if (response.status !== 201) {
                const error: any = await response.json();
                return new ApiResponse({ isSuccessful: false, message: `Register Failed: ${error? apiErrorResponseParser(error): `${response.status}: ${response.statusText}`}!` });
            } else {
                return new ApiResponse({ isSuccessful: true, message: 'Registered successfully, You can login now!' });
            }
        } catch (ex) {
            console.error(ex);
            return new ApiResponse({ isSuccessful: false, message: `Failed to Register, Please contact support!` });
        }
    }
}