import {
    render
} from '@testing-library/react';
import {
    BrowserRouter
} from 'react-router-dom';
import Login from './LoginPage';

describe('Login Page main elements', () => {
    it('renders the Login page', () => {
        const {
            getByText
        } = render( < Login / > , {
            wrapper: BrowserRouter
        });
        expect(getByText(/Sign In/i)).toBeInTheDocument();
    });

    it('renders the 2 input components', () => {
        const {
            getByLabelText
        } = render( < Login / > , {
            wrapper: BrowserRouter
        });
        expect(getByLabelText(/Email/i)).toBeInTheDocument();
        expect(getByLabelText(/Password/i)).toBeInTheDocument();
    });

    it('renders the a Login button', () => {
        const {
            getByText
        } = render( < Login / > , {
            wrapper: BrowserRouter
        });
        expect(getByText("Login")).toBeInTheDocument();
    });
});