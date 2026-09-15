import { ReactNode } from 'react';
import EmptyState from './EmptyState';
import Loading from './Loading';

export interface Column<T> {
  key: keyof T | string;
  header: string;
  width?: string;
  render?: (row: T) => ReactNode;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  emptyIcon?: ReactNode;
  keyExtractor: (row: T) => string | number;
}

export default function Table<T>({
  columns,
  data,
  loading = false,
  emptyMessage = 'Nenhum registro encontrado.',
  emptyIcon,
  keyExtractor,
}: TableProps<T>) {
  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loading text="Carregando..." />
      </div>
    );
  }

  if (data.length === 0) {
    return <EmptyState message={emptyMessage} icon={emptyIcon} />;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-neo-lighter border-b border-border">
            {columns.map((col) => (
              <th
                key={String(col.key)}
                style={{ width: col.width }}
                className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wide"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={keyExtractor(row)}
              className={`
                border-b border-border last:border-0 transition-colors
                ${i % 2 === 0 ? 'bg-card' : 'bg-neo-lighter/40'}
                hover:bg-neo-light/50
              `}
            >
              {columns.map((col) => (
                <td key={String(col.key)} className="px-4 py-3 text-text-primary">
                  {col.render
                    ? col.render(row)
                    : String((row as Record<string, unknown>)[String(col.key)] ?? '—')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
