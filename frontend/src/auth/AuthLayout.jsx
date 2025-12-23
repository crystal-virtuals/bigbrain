import { AuthLayout } from '@components/auth-layout'
import { Outlet } from "react-router-dom";

export default function AuthenticateLayout() {
  return (
    <AuthLayout>
      <Outlet />
    </AuthLayout>
  );
}