import { AdminLayout } from '@/admin';
import { AuthLayout, Login, Logout, Register } from '@/auth';
import { Dashboard } from '@/dashboard';
import EditGame from '@/game/EditGame';
import { PrivateRoute } from '@/routes';
import { AuthProvider } from '@hooks/auth';
import { ToastProvider } from '@hooks/toast';
import { NotFound, Unauthorized } from '@pages/errors';
import { Home, Landing } from '@pages/public';
import { Outlet, Route, Routes, useParams } from 'react-router-dom';

function EditQuestion() {
  const { gameId, questionId } = useParams();

  return (
    <div>
      Editing question {questionId} of game {gameId}
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
          <Route element={<AdminLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="game/:gameId" element={<EditGame />} />
            <Route path="game/:gameId/question/:questionId" element={<EditQuestion />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
