export function Card({ children }) {
  return (
    <div className="bg-white dark:bg-pink-100/5 shadow-xs ring-1 ring-zinc-900/5 sm:rounded-xl md:col-span-2">
      {children}
    </div>
  );
}
