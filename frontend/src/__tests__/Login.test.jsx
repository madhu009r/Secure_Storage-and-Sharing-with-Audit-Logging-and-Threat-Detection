import { render, screen } from '@testing-library/react';
import Login from '../pages/Login';
import { AuthProvider } from '../context/AuthContext';
test('renders login form', () => {
  render(<AuthProvider><Login /></AuthProvider>);
  expect(screen.getByText(/Login/)).toBeInTheDocument();
});
