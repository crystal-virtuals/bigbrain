import { Navigate } from "react-router-dom";
import { useAuth } from "@hooks/auth";

const Home = () => {
  const { user } = useAuth();
  const destination = (user && user.authenticated) ? '/dashboard' : '/';
  return <Navigate to={destination} replace />;
};

export default Home;
