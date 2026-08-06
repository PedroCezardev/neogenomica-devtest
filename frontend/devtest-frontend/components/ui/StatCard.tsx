interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  accent?: boolean; // fundo escuro (destaque)
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon,
  accent = false,
}: StatCardProps) {
  return (
    <div
      className={`
        rounded-xl p-5 flex flex-col gap-3 shadow-sm transition-all duration-200
        hover:shadow-md hover:-translate-y-0.5
        ${accent
          ? 'bg-neo-dark text-white'
          : 'bg-card border border-border text-text-primary'
        }
      `}
    >
      <div className="flex items-center justify-between">
        <span className={`text-sm font-medium ${accent ? 'text-neo-light' : 'text-text-muted'}`}>
          {title}
        </span>
        <div
          className={`
            w-9 h-9 rounded-lg flex items-center justify-center
            ${accent ? 'bg-neo-teal/20 text-neo-light' : 'bg-neo-lighter text-accent'}
          `}
        >
          {icon}
        </div>
      </div>

      <div>
        <p className="text-2xl font-bold tracking-tight">{value}</p>
        {subtitle && (
          <p className={`text-xs mt-0.5 ${accent ? 'text-neo-light/70' : 'text-text-muted'}`}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
