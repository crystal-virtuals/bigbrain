import { useEffect, useRef } from 'react';
import { useAuth } from '@hooks/auth';
import { useToast } from '@hooks/toast';

export default function Logout() {
  const { logout } = useAuth();
  const toastify = useToast();
  const hasLoggedOut = useRef(false);

  useEffect(() => {
    if (!hasLoggedOut.current) {
      hasLoggedOut.current = true;
      logout();
      toastify.success({
        message: 'Successfully logged out',
        description: 'See you next time!',
      });
    }
  }, []);

  return null;
}
