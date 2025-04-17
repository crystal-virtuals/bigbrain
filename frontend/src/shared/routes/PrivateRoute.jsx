import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@hooks/auth";

const PrivateRoute = () => {
  const { user } = useAuth();

  // If not logged in, redirect to the login page
  if (!user) {
    return <Navigate to="/login" />;
  }

  // If logged in,
  // render the matching child route of a parent route or
  // nothing if no child route matches.
  return (
    <Outlet />
  );
};

export default PrivateRoute;
