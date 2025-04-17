import { Navigate } from 'react-router-dom';
import { useAuth } from '@hooks/auth';

export default function Authenticate() {
  const { user } = useAuth();

  // Redirect to dashboard if logged in, else to login
  if (user) {
    return <Navigate to="/dashboard" replace />;
  } else {
    return <Navigate to="/login" replace />;
  }
}