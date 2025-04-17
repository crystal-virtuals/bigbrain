// App container
export default function AppLayout({ children }) {
  const classes = 'h-screen w-screen bg-white lg:bg-zinc-100 dark:bg-zinc-900 dark:lg:bg-zinc-950';
  return (
    <div className={classes}>
      {children}
    </div>
  );
}
