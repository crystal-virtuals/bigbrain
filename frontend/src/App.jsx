import { AuthLayout, Login, Logout, Register } from '@/auth';
import {
  AdminLayout,
  GameLayout,
  EditGame,
  EditQuestion,
} from '@/admin';
import { Dashboard } from '@/dashboard';
import { AuthProvider } from '@hooks/auth';
import { ToastProvider } from '@hooks/toast';
import { NotFound, Unauthorized } from '@pages/errors';
import { Home, Landing } from '@pages/public';
import { Outlet, Route, Routes } from 'react-router-dom';
import { SessionLayout, AdminSession } from '@/session';


function PlayJoin() {
  return (
    <h1>Enter session id</h1>
  )
}

function PlaySession() {
  return (
    <h1>Play session</h1>
  )
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

        {/* Admin routes (user must be authorised) */}
        <Route element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />

          <Route path="game/:gameId" element={<GameLayout />}>
            <Route index element={<EditGame />} />
            <Route path="question/:questionId" element={<EditQuestion />}/>
          </Route>

          <Route path="session/:sessionId" element={<SessionLayout />}>
            <Route index element={<AdminSession />} />
          </Route>
        </Route>

        {/* Player routes (no auth) */}
        <Route path="play" element={<PlayJoin />} /> {/* Join a session */}
        <Route path="play/:sessionId" element={<PlaySession />} /> {/* Play a session */}


        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
