interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export default function PageHeader({
  title,
  subtitle,
}: PageHeaderProps) {
  return (
    <section className="mb-8 rounded-[2rem] border border-border/10 bg-slate-900/80 p-6 shadow-lg shadow-slate-950/20 backdrop-blur-xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Overview</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-primary-foreground sm:text-4xl">
            {title}
          </h1>
        </div>

        {subtitle ? (
          <p className="max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
            {subtitle}
          </p>
        ) : null}
      </div>
    </section>
  );
}
