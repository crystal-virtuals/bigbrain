export function Section({ children }) {
  return (
    <section className="dark:bg-black/25 ring-2 ring-green dark:ring-green/50 bg-secondary-100 rounded-2xl overflow-hidden w-full flex-1 h-full lg:max-h-[700px]">
      {children}
    </section>
  );
}

export function SectionHeader({ children }) {
  return (
    <div className="px-4 py-5 sm:px-6 w-full dark:bg-zinc-950 bg-secondary-200 text-neutral-content">
      {children}
    </div>
  );
}

export function SectionContent({ children }) {
  return (
    <div className="px-4 py-5 sm:p-6 flex-1 w-full">
      <div className="flex flex-col items-center justify-between flex-1 w-full gap-4 h-full">
        {children}
      </div>
    </div>
  );
}

export function AdminSessionLayout({ children }) {
  return (
    <div className="flex flex-col lg:flex-row gap-8 w-full h-screen px-2 lg:px-10 py-4 lg:py-10">
      {children}
    </div>
  );
}
