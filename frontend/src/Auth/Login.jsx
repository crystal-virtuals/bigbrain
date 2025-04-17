import { useAuth } from '@hooks/auth';
import { api } from '@utils/api';
import AuthForm from './AuthForm';

export default function Login() {
  const { login } = useAuth();

  const handleLogin = ({ email, password }) => {
    const credentials = { email, password };
    return new Promise((resolve, reject) => {
      api
        .post('/admin/auth/login', credentials)
        .then((response) => {
          login(response.token, credentials);
          resolve({
            message: 'Successfully logged in',
            description: 'Welcome back!',
          });
        })
        .catch((error) => {
          reject({
            data: error.data,
            message: 'Login failed',
            description: (error.status === 400)
              ? 'Invalid credentials. Please try again.'
              : `${error.message}. Please try again later.`,
          });
        });
    });
  };

  return <AuthForm isLogin={true} onSubmit={handleLogin} />;
}
