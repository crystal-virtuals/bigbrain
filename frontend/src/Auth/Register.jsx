import { useAuth } from '@hooks/auth';
import { api } from '@utils/api';
import AuthForm from './components/AuthForm';

export default function Register() {
  const { login } = useAuth();

  const handleRegister = ({ email, password, name }) => {
    const credentials = { email, password, name };
    return new Promise((resolve, reject) => {
      api
        .post('/admin/auth/register', credentials)
        .then((response) => {
          login(response.token, credentials);
          resolve({
            message: 'Successfully registered',
            description: `Welcome aboard, ${name}!`,
          });
        })
        .catch((error) => {
          reject({
            data: error.data,
            message: 'Registration failed',
            description: (error.status === 400)
              ? 'Invalid input. Please check your details.'
              : `${error.message}. Please try again later.`,
          });
        });
    });
  };

  return <AuthForm isLogin={false} onSubmit={handleRegister} />;
}
