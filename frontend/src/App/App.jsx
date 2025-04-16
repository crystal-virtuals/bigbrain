import { AuthLayout, Login, Register } from '@/auth';
import { Dashboard } from '@/dashboard';
import { AuthProvider } from '@hooks/auth';
import { ToastProvider } from '@hooks/toast';
import { Route, Routes } from 'react-router-dom';
import PrivateRoute from './routes/PrivateRoute';

function Home() {
  return <h2>Home</h2>;
}

function NotFound() {
  return <h2>404 Not Found</h2>;
}

function App() {
  return (
    <>
      <ToastProvider>
        <AuthProvider>
          <Routes>
            <Route index element={<Home />} />
            <Route path="*" element={<NotFound />} />

            {/* Auth routes */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>

            {/* Private (protected) routes */}
            <Route element={<PrivateRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>

          </Routes>
        </AuthProvider>
      </ToastProvider>
    </>
  );
}

export default App;
