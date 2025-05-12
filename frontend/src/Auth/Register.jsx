import { useAuth } from '@hooks/auth';
import AuthForm from './AuthForm';

export default function Register() {
  const { register } = useAuth();

  const handleRegister = async ({ email, password, name }) => {
    const credentials = { email, password, name };
    return await register(credentials);
  };

  return <AuthForm isLogin={false} onSubmit={handleRegister} />;
}
