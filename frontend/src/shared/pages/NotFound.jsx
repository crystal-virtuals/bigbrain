import { Link } from '@components/link';
import { Text } from '@components/text';
import { Branding } from '@components/branding';

export default function NotFound() {
  return (
    <>
      <div className="grid min-h-full grid-cols-1 grid-rows-[1fr_auto_1fr] lg:grid-cols-[max(50%,36rem)_1fr]">
        <header className="mx-auto w-full max-w-7xl px-6 pt-6 sm:pt-10 lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:px-8">
          <Link to="/home" aria-label="Home" className="inline-flex">
            <Branding className="size-8"/>
          </Link>
        </header>
        <main className="mx-auto w-full max-w-7xl px-6 py-24 sm:py-32 lg:col-span-2 lg:col-start-1 lg:row-start-2 lg:px-8">
          <div className="max-w-lg">
            <span className="text-base/8 font-semibold text-accent">404</span>
            <h1 className="mt-4 text-5xl font-semibold tracking-tight text-pretty sm:text-6xl text-zinc-950 dark:text-white">
              Page not found
            </h1>
            <Text className="mt-6 text-lg font-medium text-pretty sm:text-xl/8">
              Sorry, we couldn’t find the page you’re looking for.
            </Text>
            <div className="mt-10">
              <Link to="/home" className="text-sm/7 font-semibold text-pretty text-accent">
                <span aria-hidden="true">&larr;</span> Back to home
              </Link>
            </div>
          </div>
        </main>
        <div className="hidden lg:relative lg:col-start-2 lg:row-start-1 lg:row-end-4 lg:block">
          <img
            alt=""
            src="https://images.unsplash.com/photo-1470847355775-e0e3c35a9a2c?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1825&q=80"
            className="absolute inset-0 size-full object-cover"
          />
        </div>
      </div>
    </>
  )
}
