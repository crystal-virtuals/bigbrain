import { useContext  } from 'react';
import AuthContext from './AuthContext';

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  const adminUser = {
    ...context.user,
    role: 'admin',
    authenticated: !!context.user, // not null or undefined
  }

  return { ...context, user: adminUser };
}

export default useAuth;