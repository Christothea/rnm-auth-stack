import {
    act,
    fireEvent,
    render,
    screen
} from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Registration from './RegistrationPage';

describe('Registration Page main elements', () => {
    it('renders the Registration page', () => {
        const {
            getByText
        } = render( < Registration / >, { wrapper: BrowserRouter } );
         expect(getByText(/Sign Up/i, { exact: true })).toBeInTheDocument();
    });

    it('renders the 3 input components', () => {
        const {
            getByLabelText
        } = render( < Registration / >, { wrapper: BrowserRouter } );
        expect(getByLabelText(/Full name/i)).toBeInTheDocument();
        expect(getByLabelText(/Email/i)).toBeInTheDocument();
        expect(getByLabelText(/Password/i)).toBeInTheDocument();
    });

    it('renders the a submit button', () => {
        const {
            getByText
        } = render( < Registration / >, { wrapper: BrowserRouter } );
        expect(getByText("Register")).toBeInTheDocument();
    });
});

describe("Registration Form behaviour",  () => {
  it('validate user inputs, and provides error messages', async () => {
    const { getByTestId, getByText } = render(<Registration/>, { wrapper: BrowserRouter })

    await act (async () => {
      fireEvent.change(screen.getByLabelText(/Full name/i), {
        target: {value: 't'},
      });

      fireEvent.change(screen.getByLabelText(/Email/i), {
        target: {value: 't@'},
      });

      fireEvent.change(screen.getByLabelText(/Password/i), {
        target: {value: 'test'},
      });
    });

    await act (async () => {
      fireEvent.submit(getByTestId('form'))
    });

    expect(getByText('Full name must be at least 5 characters long!')).toBeInTheDocument();
    expect(getByText('Invalid Email!')).toBeInTheDocument();
    expect(getByText('Password must be at least 8 characters long!')).toBeInTheDocument();
  });

  it('should submit when form inputs contain text', async () => {
    const { getByTestId, queryByText } = render(<Registration/>, { wrapper: BrowserRouter })

    await act(async () => {
        fireEvent.change(screen.getByLabelText(/Full name/i), {
            target: {value: 'John Smith'},
          });
    
          fireEvent.change(screen.getByLabelText(/Email/i), {
            target: {value: 'john.s@test.com'},
          });
    
          fireEvent.change(screen.getByLabelText(/Password/i), {
            target: {value: 'testing3333'},
          });
    });

    await act (async () => {
      fireEvent.submit(getByTestId('form'))
    });

    expect(queryByText('Full name must be at least 5 characters long!')).not.toBeInTheDocument();
    expect(queryByText('Invalid Email!')).not.toBeInTheDocument();
    expect(queryByText('Password must be at least 8 characters long!')).not.toBeInTheDocument();
  });

  it('validate user password', async () => {
    const { getByTestId, getByText } = render(<Registration/>, { wrapper: BrowserRouter })

    await act (async () => {
        fireEvent.change(screen.getByLabelText(/Full name/i), {
            target: {value: 'John Smith'},
          });
    
          fireEvent.change(screen.getByLabelText(/Email/i), {
            target: {value: 'john.s@test.com'},
          });
    
          fireEvent.change(screen.getByLabelText(/Password/i), {
            target: {value: 'testtest'},
          });
    });

    await act (async () => {
      fireEvent.submit(getByTestId('form'))
    });

    expect(getByText('Password must contain at least one letter and one number!')).toBeInTheDocument();
  });
});