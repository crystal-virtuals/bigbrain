import { AuthLayout, Login, Logout, Register } from '@/auth';
import { AdminLayout } from '@/admin';
import { Dashboard } from '@/dashboard';
import { GameLayout, EditGame } from '@/game';
import { QuestionLayout, EditQuestion } from '@/question';
import { AuthProvider } from '@hooks/auth';
import { ToastProvider } from '@hooks/toast';
import { SessionProvider } from '@hooks/session';
import { NotFound, Unauthorized } from '@pages/errors';
import { Home, Landing } from '@pages/public';
import { Outlet, Route, Routes } from 'react-router-dom';
import { SessionLayout, AdminSession } from '@/session';
import { PlayerLayout, PlayerSession, PlayerJoin } from '@/player';

function AppLayout() {
  const classes =
    'h-screen w-screen bg-white lg:bg-zinc-100 dark:bg-zinc-900 dark:lg:bg-zinc-950';

  return (
    <div className={classes}>
      <ToastProvider>
        <AuthProvider>
          <SessionProvider>
            <Outlet />
          </SessionProvider>
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

        {/* Admin routes (user must be authorised) */}
        <Route element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />

          <Route path="game/:gameId" element={<GameLayout />}>
            <Route index element={<EditGame />} />
            <Route path="question/:questionId" element={<QuestionLayout />}>
              <Route index element={<EditQuestion />} />
            </Route>
          </Route>

          <Route path="session/:sessionId" element={<SessionLayout />}>
            <Route index element={<AdminSession />} />
          </Route>
        </Route>

        {/* Player routes (no auth) */}
        <Route path="/play" element={<PlayerLayout />}>
          <Route index element={<PlayerJoin />} />
          <Route path=":sessionId" element={<PlayerJoin />} />
          <Route path=":sessionId/:playerId" element={<PlayerSession />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
