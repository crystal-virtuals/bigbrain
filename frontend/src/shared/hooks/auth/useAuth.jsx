import { useContext  } from 'react';
import AuthContext from './AuthContext';

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  const user = {
    email: context.user?.email,
    name: context.user?.name,
    role: context.user?.role || 'admin',
    authenticated: !!context.user,
  }

  return { ...context, user };
}

export default useAuth;