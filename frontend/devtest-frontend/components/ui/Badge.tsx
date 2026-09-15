interface BadgeProps {
  children: React.ReactNode;
  variant?: 'teal' | 'blue' | 'green' | 'yellow' | 'red' | 'gray';
  size?: 'sm' | 'md';
}

const variants = {
  teal:   'bg-neo-light text-neo-teal-dark',
  blue:   'bg-blue-50 text-blue-700',
  green:  'bg-green-50 text-green-700',
  yellow: 'bg-yellow-50 text-yellow-700',
  red:    'bg-red-50 text-red-700',
  gray:   'bg-gray-100 text-gray-600',
};

const sizes = {
  sm: 'text-xs px-2 py-0.5 rounded-md',
  md: 'text-xs px-2.5 py-1 rounded-lg',
};

// Mapeamento automático de materiais para variante
export function materialVariant(material: string): BadgeProps['variant'] {
  const m = material.toLowerCase();
  if (m.includes('dna')) return 'teal';
  if (m.includes('swab')) return 'blue';
  if (m.includes('sangue')) return 'red';
  return 'gray';
}

export default function Badge({
  children,
  variant = 'teal',
  size = 'md',
}: BadgeProps) {
  return (
    <span className={`inline-flex items-center font-medium ${variants[variant]} ${sizes[size]}`}>
      {children}
    </span>
  );
}
