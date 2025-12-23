import { useEffect, useRef } from 'react';
import { useAuth } from '@hooks/auth';
import { useToast } from '@hooks/toast';

export default function Logout() {
  const { logout } = useAuth();
  const toastify = useToast();
  const hasLoggedOut = useRef(false);

  useEffect(() => {
    const handleLogout = async () => {
      if (!hasLoggedOut.current) {
        hasLoggedOut.current = true;
        await logout();
        toastify.success({
          message: 'Successfully logged out',
          description: 'See you next time!',
        });
      }
    };
    handleLogout();
  }, []);

  return null;
}
