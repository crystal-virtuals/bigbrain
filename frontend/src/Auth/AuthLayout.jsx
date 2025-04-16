import { AuthLayout } from '@components/auth-layout'
import { Outlet } from "react-router-dom";

export default function Authenticate() {
  return (
    <AuthLayout>
      <Outlet />
    </AuthLayout>
  );
}