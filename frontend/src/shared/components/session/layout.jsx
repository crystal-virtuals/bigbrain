export function Layout({ navbar, children }) {
  return (
    <div className="relative isolate flex min-h-svh w-full flex-col bg-white lg:bg-zinc-100 dark:bg-zinc-900 dark:lg:bg-zinc-950">
      {/* Header */}
      <header className="hidden md:flex items-center px-4">
        <div className="min-w-0 flex-1">
          <div className="min-w-0 flex-1">{navbar}</div>
        </div>
      </header>

      {/* Content */}
      <main className="flex min-h-dvh flex-col p-2 min-w-full">
        {children}
      </main>
    </div>
  );
}
