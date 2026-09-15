interface LoadingProps {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
  fullPage?: boolean;
}

const sizes = {
  sm: 'w-4 h-4 border-2',
  md: 'w-7 h-7 border-2',
  lg: 'w-10 h-10 border-[3px]',
};

export default function Loading({
  text,
  size = 'md',
  fullPage = false,
}: LoadingProps) {
  const content = (
    <div className="flex flex-col items-center gap-3">
      <div
        className={`
          ${sizes[size]} rounded-full
          border-neo-light border-t-neo-teal
          animate-spin
        `}
        role="status"
        aria-label="Carregando"
      />
      {text && (
        <p className="text-sm text-text-muted animate-pulse">{text}</p>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-content/80 backdrop-blur-sm z-40">
        {content}
      </div>
    );
  }

  return content;
}
