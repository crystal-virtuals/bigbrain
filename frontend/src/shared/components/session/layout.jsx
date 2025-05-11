export function Layout({ navbar, children }) {
  return (
    <div className="relative isolate flex min-h-svh w-full flex-col bg-white lg:bg-zinc-100 dark:bg-zinc-900 dark:lg:bg-zinc-950">
      {/* Header */}
      <header className="hidden md:flex items-center px-4 h-16"> {/* Added fixed height */}
        <div className="min-w-0 flex-1">
          <div className="min-w-0 flex-1">{navbar}</div>
        </div>
      </header>
      {/* Main content */}
      <main className="flex-1 flex flex-col p-4 w-full">
        {children}
      </main>
    </div>
  );
}
