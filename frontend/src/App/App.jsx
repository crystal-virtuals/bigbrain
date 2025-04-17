import { AppLayout } from '@/app';
import { Authenticate, AuthLayout, Login, Logout, Register } from '@/auth';
import { Dashboard } from '@/dashboard';
import { AuthProvider } from '@hooks/auth';
import { ToastProvider } from '@hooks/toast';
import { Landing, NotFound } from '@pages';
import { PrivateRoute } from '@routes';
import { Route, Routes } from 'react-router-dom';

function App() {
  return (
    <AppLayout>
      <ToastProvider>
        <AuthProvider>
          <Routes>
            {/* Authenticate on load */}
            <Route index element={<Authenticate />} />

            {/* Public routes */}
            <Route path="/home" element={<Landing />} />
            <Route path="*" element={<NotFound />} />

            {/* Auth routes */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/logout" element={<Logout />} />
            </Route>

            {/* Protected routes */}
            <Route element={<PrivateRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>

          </Routes>
        </AuthProvider>
      </ToastProvider>
    </AppLayout>
  );
}

export default App;
