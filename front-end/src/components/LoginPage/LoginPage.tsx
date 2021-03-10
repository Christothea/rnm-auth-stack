import React from 'react';
import { Link } from 'react-router-dom';
import { UserProfileContext } from '../../context/user-profile.context';
import { ApiResponse } from '../../models/api-response';
import { LoginRequest } from '../../models/login-request.model';
import { UserProfile } from '../../models/user-profile.model';
import { AuthenticationService } from '../../services/auth.service';
import { EmailRegex } from '../../utils/validdation-regex';
import { LoginState } from './LoginState';

export default class Login extends React.Component {
    constructor(props: any) {
        super(props);
        this.state = new LoginState();
        this.handleLogin = this.handleLogin.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    async handleLogin(event: any, profileContext: UserProfile) {
        event.preventDefault();
        const loginState: LoginState = new LoginState(this.state);

        const validity = this.isFormDataValid(loginState);
        if (validity === true) {
            let apiResponse: ApiResponse;
            let userProfile: UserProfile;
            [apiResponse, userProfile] = await AuthenticationService.login(new LoginRequest(loginState));

            if (apiResponse.isSuccessful) {
                profileContext.userStateChanged(userProfile);
            } else {
                this.setState(Object.assign(this.state, { submitResponse: apiResponse }));
            }
        } else {
            this.setState(Object.assign(this.state, { submitResponse: new ApiResponse({ isSuccessful: false, message: 'Please fill all required fields with valid values!' }) }));
        }
    }

    handleChange = (event: any) => {
        event.preventDefault();
        const { name, value } = event.target;
        const loginState: LoginState = new LoginState(this.state);
        let errors = loginState.validationErrors;
        switch (name) {
            case 'email':
                errors.email = EmailRegex.test(value) ? '' : 'Please enter valid email!';
                break;
            case 'password':
                errors.password = value.length === 0 ? 'Please enter password!' : '';
                break;
            default:
                break;
        }
        this.setState(Object.assign(this.state, { validationErrors: errors, [name]: value }));
    }

    isFormDataValid(loginState?: LoginState): boolean {
        loginState = loginState || new LoginState(this.state);
        for (const error of Object.values(loginState.validationErrors)) {
            if (error.length > 0) {
                return false;
            }
        }

        return true;
    }

    render() {
        const loginState: LoginState = new LoginState(this.state);
        const errors = loginState.validationErrors;

        return (
            <UserProfileContext.Consumer>
                {(userProfile: UserProfile) => (
                    <div className="auth-wrapper">
                        <div className="auth-inner">
                            <form onSubmit={e => this.handleLogin(e, userProfile)} data-testid="form">
                                <h3>Sign In</h3>

                                <div className="form-group">
                                    <label htmlFor="emaili">Email</label>
                                    <input type="email" className="form-control" id="emaili" name="email" placeholder="Enter email" required onChange={this.handleChange} />
                                    {errors.email.length > 0 && <span style={{ color: "red" }}>{errors.email}</span>}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="passwordi">Password</label>
                                    <input type="password" className="form-control" id="passwordi" name="password" placeholder="Enter password" required onChange={this.handleChange} />
                                    {errors.password.length > 0 && <span style={{ color: "red" }}>{errors.password}</span>}
                                </div>

                                <p>
                                    <span style={{ color: (loginState.submitResponse.isSuccessful === true ? "green" : "red") }}>{loginState.submitResponse.message}</span>
                                </p>

                                <button type="submit" className="btn btn-primary btn-block">Login</button>
                                <p className="forgot-password text-left">
                                    Not Registered? <Link to={"/registration"}>Register</Link>
                                </p>
                            </form>
                        </div>
                    </div>
                )}
            </UserProfileContext.Consumer>
        );
    }
}