import { PageLayout } from "@components/page-layout";
import { Navigate, Outlet } from 'react-router-dom';

function Authenticate({ user, redirectPath = '/login', children }) {
  // wait for user to be set
  if (user === null) return null;

  if (user && !user.authenticated) {
    console.log('User is not authenticated, redirecting to login');
    return <Navigate to={redirectPath} replace />;
  }

  return children ? children : <Outlet />;
}

export default function PlaySession() {
  return <PageLayout />
}