import { useAuth } from '@hooks/auth';
import { authAPI } from "@services/api";
import { InputError } from '@services/error';
import AuthForm from './AuthForm';

export default function Login() {
  const { login } = useAuth();

  const handleLogin = async ({ email, password }) => {
    const credentials = { email, password };

    try {
      const token = await authAPI.login(credentials);
      login(token, { email, name: '' });
      return {
        message: 'Successfully logged in',
        description: 'Welcome back!',
      };
    } catch (error) {
      if (error instanceof InputError) {
        error.toast = {
          message: 'Login failed',
          description: 'Invalid input. Please check your details.',
        };
      } else {
        error.toast = {
          message: 'Login failed',
          description: `${error.message}`,
        };
      }
      throw error;  // Re-throw the modified error
    };
  };

  return <AuthForm isLogin={true} onSubmit={handleLogin} />;
}
