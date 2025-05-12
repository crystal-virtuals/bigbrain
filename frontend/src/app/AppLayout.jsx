import { AuthProvider } from '@hooks/auth';
import { SessionProvider } from '@hooks/session';
import { ToastProvider } from '@hooks/toast';
import { ErrorBoundary } from 'react-error-boundary';
import { Outlet } from 'react-router-dom';
import { ErrorFallback } from '@/errors';

function Application() {
  return (
    <div className="h-screen w-screen bg-white lg:bg-zinc-100 dark:bg-zinc-900 dark:lg:bg-zinc-950">
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

function AppLayout() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Application />
    </ErrorBoundary>
  );
}

export default AppLayout;
