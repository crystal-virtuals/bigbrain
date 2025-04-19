import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@hooks/auth';

const AuthenticatedRoute = () => {
  const { user } = useAuth();
  const isAuthorized = user && user.authenticated;
  const location = useLocation();

  if (!isAuthorized) {
    return (
      <Navigate
        to={RoutesEnum.LOGIN}
        replace
        state={{ redirectTo: location }}
      />
    );
  }

  return (
    <Outlet />
  );
};

// Protect authenticated routes
const PrivateRoute = () => {
  const { user } = useAuth();

  // If the user is authenticated, render the child routes under this route.
  // Otherwise, redirect to the homepage.
  return user && user.authenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/home" replace />
  );
};

export default PrivateRoute;
