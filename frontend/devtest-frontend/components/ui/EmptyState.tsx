import { ReactNode } from 'react';

interface EmptyStateProps {
  message?: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

const DefaultIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="text-neo-teal/40">
    <rect x="8" y="8" width="24" height="24" rx="4" stroke="currentColor" strokeWidth="2"/>
    <path d="M15 20h10M20 15v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
  </svg>
);

export default function EmptyState({
  message = 'Nenhum dado encontrado.',
  description,
  icon,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in">
      <div className="mb-4">{icon ?? <DefaultIcon />}</div>
      <p className="text-sm font-medium text-text-muted">{message}</p>
      {description && (
        <p className="text-xs text-text-muted/70 mt-1 max-w-xs">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
