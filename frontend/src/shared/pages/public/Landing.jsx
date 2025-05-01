import { Branding } from '@components/branding';
import { TextLink } from '@components/text';
import { useAuth } from '@hooks/auth';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';

function ButtonCTA({ children, color, onClick }) {
  const colors = {
    white: 'text-pink-500 bg-white hover:bg-pink-100',
    dark: 'text-white bg-pink-500/60 hover:bg-pink-500/70',
    gradient:
      'bg-gradient-to-r from-pink-300 to-pink-600 bg-origin-border text-white hover:from-pink-400 hover:to-pink-700',
  };

  return (
    <button
      type="button"
      className={clsx(
        colors[color],
        'flex items-center justify-center rounded-md border border-transparent px-4 py-3 text-base font-medium shadow-xs sm:px-8'
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default function Landing() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const authenticate = () => {
    // Redirect to dashboard if logged in
    if (user && user.authenticated) {
      return navigate('/dashboard');
    }
    // Else, show the public landing page
    return navigate('/login');
  };

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      <header className="absolute inset-x-0 top-0 z-50">
        <nav
          aria-label="Global"
          className="flex items-center justify-between p-6 lg:px-8"
        >
          <div className="flex lg:flex-1">
            <TextLink
              to="/home"
              aria-label="Home"
              className="-m-1.5 p-1.5 flex items-center gap-2 py-1.5 w-full justify-start"
            >
              <Branding size="sm" />
            </TextLink>
          </div>

          <div className="lg:flex lg:flex-1 lg:justify-end">
            <TextLink to="/login" className="text-sm/6 font-semibold">
              Log in <span aria-hidden="true">&rarr;</span>
            </TextLink>
          </div>
        </nav>
      </header>

      <main className="isolate">
        <div className="relative pt-14 lg:px-8">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          >
            <div
              style={{
                clipPath:
                  'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
              }}
              className="relative left-[calc(50%-11rem)] aspect-1155/678 w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            />
          </div>
          <div className="mx-auto max-w-2xl py-32 sm:py-56 lg:py-96">
            <div className="text-center">
              <h1 className="text-5xl font-semibold tracking-tight text-balance text-gray-900 dark:text-white sm:text-7xl">
                Welcome to BigBrain
              </h1>
              <p className="mt-8 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
                Create your own immersive game complete with questions, images, and so much more!
                Add questions, host a session, and invite some friends to get the party started!
              </p>

              <div className="mt-10 flex items-center justify-center gap-x-8">
                <ButtonCTA color="gradient" onClick={authenticate}>
                  Get started
                </ButtonCTA>
                <TextLink to="/register" className="text-sm/6 font-semibold">
                  Sign up today <span aria-hidden="true">&rarr;</span>
                </TextLink>
              </div>
            </div>
          </div>
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
          >
            <div
              style={{
                clipPath:
                  'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
              }}
              className="relative left-[calc(50%+3rem)] aspect-1155/678 w-[36.125rem] -translate-x-1/2 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
            />
          </div>
        </div>
      </main>
      {/* Footer */}
      <footer className="relative mx-auto mt-50 px-6 lg:px-8">
        <div className="px-16 border-t border-gray-900/10 dark:border-white/10 py-10 md:flex md:items-center md:justify-between">
          <p className="mt-8 text-center text-sm/6 text-gray-600 dark:text-gray-400 md:order-1 md:mt-0">
            &copy; {new Date().getFullYear()} BigBrain - All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
