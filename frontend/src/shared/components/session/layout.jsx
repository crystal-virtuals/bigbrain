export function Layout( { navbar, children }) {
  return (
    <main className="flex min-h-svh w-full flex-col bg-white lg:bg-zinc-100 dark:bg-zinc-900 dark:lg:bg-zinc-950">

      {/* Header */}
      <header className="hidden md:flex items-center px-4">
        <div className="min-w-0 flex-1">
          <div className="min-w-0 flex-1">{navbar}</div>
        </div>
      </header>

      {/* Content */}
      <main className="flex min-h-dvh flex-col p-2">
        <div className="flex grow items-center justify-center p-6 lg:rounded-lg lg:bg-white lg:p-10 lg:shadow-xs lg:ring-1 lg:ring-zinc-950/5 dark:lg:bg-zinc-900 dark:lg:ring-white/10">
          {children}
        </div>
      </main>
    </main>
  );
}