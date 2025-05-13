import { AdminLayout } from '@/admin';
import { AppLayout } from '@/app';
import { AuthLayout, Login, Logout, Register } from '@/auth';
import { Dashboard } from '@/dashboard';
import { NotFound } from '@/errors';
import { EditGame, GameLayout } from '@/game';
import { PlayerJoin, PlayerLayout, PlayerSession } from '@/player';
import { EditQuestion, QuestionLayout } from '@/question';
import { AdminSession, SessionLayout } from '@/session';
import { Home, Landing } from '@pages/public';
import { Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Landing />} />
        <Route path="home" element={<Home />} />

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
