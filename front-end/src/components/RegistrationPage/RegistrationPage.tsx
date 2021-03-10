import React from 'react';
import { Link } from 'react-router-dom';
import { ApiResponse } from '../../models/api-response';
import { RegistrationRequest } from '../../models/registration-request.model';
import { AuthenticationService } from '../../services/auth.service';
import { EmailRegex, PasswordRegex } from '../../utils/validdation-regex';
import { RegistrationState } from './RegistrationState';

export default class Registration extends React.Component {

    constructor(props: any) {
        super(props);
        this.state = new RegistrationState();
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange = (event: any) => {
        event.preventDefault();
        const { name, value } = event.target;
        const regState: RegistrationState = new RegistrationState(this.state);
        let errors = regState.validationErrors;
        switch (name) {
            case 'fullName':
                errors.fullName = value.length < 5 ? 'Full name must be at least 5 characters long!' : '';
                break;
            case 'email':
                errors.email = EmailRegex.test(value) ? '' : 'Invalid Email!';
                break;
            case 'password':
                errors.password = value.length < 8 ? 'Password must be at least 8 characters long!' :
                    PasswordRegex.test(value) ? '' : 'Password must contain at least one letter and one number!';
                break;
            default:
                break;
        }
        this.setState(Object.assign(this.state, { validationErrors: errors, [name]: value }));
    }

    async handleSubmit(event: any) {
        event.preventDefault();
        const regState: RegistrationState = new RegistrationState(this.state);

        const validity = this.isFormDataValid(regState);
        if (validity === true) {
            const apiResponse: ApiResponse = await AuthenticationService.register(new RegistrationRequest(regState));
            this.setState(Object.assign(this.state, { submitResponse: apiResponse }));
        } else {
            this.setState(Object.assign(this.state, { submitResponse: new ApiResponse({ isSuccessful: false, message: 'Please fill all required fields with valid values!' }) }));
        }
    }

    isFormDataValid(regState?: RegistrationState): boolean {
        regState = regState || new RegistrationState(this.state);
        for (const error of Object.values(regState.validationErrors)) {
            if (error.length > 0) {
                return false;
            }
        }

        return true;
    }

    render() {
        const regState: RegistrationState = new RegistrationState(this.state);
        const errors = regState.validationErrors;
        return (
            <div className="auth-wrapper">
                <div className="auth-inner">
                    <form onSubmit={this.handleSubmit} data-testid="form">
                        <h3>Sign Up</h3>

                        <div className="form-group">
                            <label htmlFor="fullnamei">Full name</label>
                            <input type="text" className="form-control" id="fullnamei" name="fullName" placeholder="Full name" required onChange={this.handleChange} />
                            {errors.fullName.length > 0 && <span style={{ color: "red" }}>{errors.fullName}</span>}
                        </div>

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
                            <span style={{ color: (regState.submitResponse.isSuccessful === true ? "green" : "red") }}>{regState.submitResponse.message}</span>
                        </p>

                        <button type="submit" className="btn btn-primary btn-block">Register</button>
                        <p className="forgot-password text-left">
                            Already registered? <Link to={"/login"}>Login</Link>
                        </p>
                    </form>
                </div>
            </div>
        );
    }
}