import { useAuth } from '@hooks/auth';
import AuthForm from './AuthForm';

export default function Login() {
  const { login } = useAuth();

  const handleLogin = async ({ email, password }) => {
    const credentials = { email, password };
    return await login(credentials);
  };

  return <AuthForm isLogin={true} onSubmit={handleLogin} />;
}
