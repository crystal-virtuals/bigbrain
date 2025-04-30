import { useAuth } from '@hooks/auth';
import { authAPI } from "@services/api";
import { InputError } from '@services/error';
import AuthForm from './AuthForm';

export default function Register() {
  const { login } = useAuth();

  const handleRegister = async ({ email, password, name }) => {
    const credentials = { email, password, name };

    try {
      const token = await authAPI.register(credentials);
      login(token, credentials);
      return {
        message: 'Successfully registered',
        description: `Welcome aboard, ${name}!`,
      };
    } catch (error) {
      if (error instanceof InputError) {
        error.toast = {
          message: 'Registration failed',
          description: 'Invalid input. Please check your details.',
        }
      } else {
        error.toast = {
          message: 'Registration failed',
          description: `${error.message}`,
        }
      }
      throw error;
    };
  };

  return <AuthForm isLogin={false} onSubmit={handleRegister} />;
}
