import { AuthLayout, Login, Logout, Register } from '@/auth';
import { Dashboard, DashboardHome } from '@/dashboard';
import { AuthProvider } from '@hooks/auth';
import { ToastProvider } from '@hooks/toast';
import { NotFound, Unauthorized } from '@pages/errors';
import { Landing, Home } from '@pages/public';
import { Route, Routes, Outlet } from 'react-router-dom';
import { PrivateRoute } from '@/routes';

function EditGame() {
  return (
    <div>
      <h1>Edit Game</h1>
    </div>
  );
}

function EditQuestion() {
  return (
    <div>
      <h1>Edit Question</h1>
    </div>
  );
}

function AppLayout() {
  const classes =
    'h-screen w-screen bg-white lg:bg-zinc-100 dark:bg-zinc-900 dark:lg:bg-zinc-950';

  return (
    <div className={classes}>
      <ToastProvider>
        <AuthProvider>
          <Outlet />
        </AuthProvider>
      </ToastProvider>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Landing />} />
        <Route path="home" element={<Home />} />
        <Route path="403" element={<Unauthorized />} />
        <Route path="404" element={<NotFound />} />

        {/* Auth routes */}
        <Route element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="logout" element={<Logout />} />
        </Route>

        {/* Private routes (user must be authorised) */}
        <Route element={<PrivateRoute />}>
          <Route path="dashboard" element={<Dashboard />}>
            <Route index element={<DashboardHome />} />
            <Route path="game/:gameId" element={<EditGame />} />
            <Route
              path="game/:gameId/question/:questionId"
              element={<EditQuestion />}
            />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
