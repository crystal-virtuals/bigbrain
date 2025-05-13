import { Branding } from '@components/branding';
import { DialogWithIcon } from '@components/dialog';
import { Heading } from '@components/heading';
import { Link } from '@components/link';
import { Text } from '@components/text';
import { API_ERRORS, NetworkError } from '@constants/errors';

export function ErrorFallback({ error, resetErrorBoundary }) {
  if (error instanceof NetworkError) {
    // show dialog
    return (
      <DialogWithIcon
        icon="error"
        onConfirm={resetErrorBoundary}
        confirmText="Retry"
        title='Network Error'
        description={error.message}
        dismissable={false}
      />
    );
  }

  const props = error.details || {
    status: 'Error',
    title: 'Something went wrong!',
    description: 'Sorry, something went wrong on our end. Please try reloading the page later.',
  };

  return <ErrorPage {...props} />;
}

function ErrorPage({ status, title, description, redirectPath, redirectText }) {

  return (
    <>
      <div className="h-screen w-screen bg-zinc-100 dark:bg-zinc-900">
        <div className="grid min-h-full grid-cols-1 grid-rows-[1fr_auto_1fr] lg:grid-cols-[max(50%,36rem)_1fr] container mx-auto">
          <header className="mx-auto w-full max-w-7xl px-6 pt-6 sm:pt-10 lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:px-8">
            <Link to="/home" aria-label="Home" className="inline-flex">
              <Branding size="md" />
            </Link>
          </header>
          <main className="mx-auto w-full max-w-7xl px-6 py-24 sm:py-32 lg:col-span-2 lg:col-start-1 lg:row-start-2 lg:px-8">
            <div className="max-w-lg">
              <span className="text-base/8 font-semibold text-accent">
                {status}
              </span>
              <Heading className="mt-4 text-5xl font-semibold tracking-tight text-pretty sm:text-6xl text-zinc-950 dark:text-white">
                {title}
              </Heading>
              <Text className="mt-6 text-lg font-medium text-pretty sm:text-xl/8">
                {description}
              </Text>
              {redirectPath && (
                <div className="mt-10">
                  <Link
                    to={redirectPath}
                    className="text-sm/7 font-semibold text-pretty text-accent"
                  >
                    <span aria-hidden="true">&larr;</span> {redirectText}
                  </Link>
                </div>
              )}
            </div>
          </main>
          <div className="hidden lg:relative lg:col-start-2 lg:row-start-1 lg:row-end-4 lg:block">
            <img
              alt=""
              src="https://veeble.com/kb/wp-content/uploads/2021/07/v9_3-1.png"
              className="absolute inset-0 size-sm object-cover top-1/2 "
            />
          </div>
        </div>
      </div>
    </>
  );
}

export function Unauthorized() {
  const props = API_ERRORS[403].details;
  return <ErrorPage {...props} />;
}

export function NotFound() {
  const props = API_ERRORS[404].details;
  return <ErrorPage {...props} />;
}
