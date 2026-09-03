interface TableProps {
  children: React.ReactNode;
}

export default function Table({
  children,
}: TableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-border/10 bg-slate-900/80 text-slate-100 shadow-lg backdrop-blur-xl">
      <table className="w-full text-left">
        {children}
      </table>
    </div>
  );
}
