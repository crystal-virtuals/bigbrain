import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AuthForm from '@/auth/AuthForm';
import { vi, describe, expect, it, beforeEach } from "vitest";

vi.mock('@hooks/toast', () => ({
  useToast: () => ({
    success: vi.fn(),
    error: vi.fn(),
  }),
}));

describe('AuthForm - Login', () => {
  const mockSubmit = vi.fn(() => Promise.resolve('Logged in!'));

  beforeEach(() => {
    render(
      <MemoryRouter> 
        <AuthForm isLogin={true} onSubmit={mockSubmit} />
      </MemoryRouter>
    );
  });

  it('renders email and password fields', () => {
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('shows validation error if fields are empty on submit', async () => {
    await userEvent.click(screen.getByRole('button', { name: /login/i }));
    expect(mockSubmit).not.toHaveBeenCalled();
    expect(await screen.findByText(/email/i)).toBeInTheDocument();
  });

  it('calls onSubmit when valid login form is submitted', async () => {
    await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'password123');
    await userEvent.click(screen.getByRole('button', { name: /login/i }));
    expect(mockSubmit).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
  });
});

describe('AuthForm - Register', () => {
  const mockSubmit = vi.fn(() => Promise.resolve('Registered!'));

  beforeEach(() => {
    render(
      <MemoryRouter>
        <AuthForm isLogin={false} onSubmit={mockSubmit} />
      </MemoryRouter>
    );
  });

  it('renders all register fields', () => {
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
  });

  it('prevents submission if passwords do not match', async () => {
    await userEvent.type(screen.getByLabelText(/email/i), 'user@site.com');
    await userEvent.type(screen.getByLabelText(/name/i), 'Tester');
    await userEvent.type(screen.getByLabelText(/^password$/i), 'abc123');
    await userEvent.type(screen.getByLabelText(/confirm password/i), 'wrong123');
    await userEvent.click(screen.getByRole('button', { name: /create account/i }));
    expect(mockSubmit).not.toHaveBeenCalled();
  });


  it('submits correct register data with matching passwords', async () => {
    await userEvent.type(screen.getByLabelText(/email/i), 'user@site.com');
    await userEvent.type(screen.getByLabelText(/name/i), 'Tester');
    await userEvent.type(screen.getByLabelText(/^password$/i), 'abc123');
    await userEvent.type(screen.getByLabelText(/confirm password/i), 'abc123');
    await userEvent.click(screen.getByRole('button', { name: /create account/i }));
    expect(mockSubmit).toHaveBeenCalledWith(expect.objectContaining({
      email: 'user@site.com',
      password: 'abc123',
      name: 'Tester',
    }));
  });

});
