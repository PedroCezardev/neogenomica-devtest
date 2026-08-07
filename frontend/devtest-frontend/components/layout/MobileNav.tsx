'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

// ─── Ícones SVG inline para a barra mobile ────────────────────────────────
const DashboardIcon = () => (
  <svg width="20" height="20" viewBox="0 0 18 18" fill="none">
    <rect x="1" y="1" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6"/>
    <rect x="10" y="1" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6"/>
    <rect x="1" y="10" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6"/>
    <rect x="10" y="10" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6"/>
  </svg>
);

const EstruturaIcon = () => (
  <svg width="20" height="20" viewBox="0 0 18 18" fill="none">
    <path d="M3 14V9.5M7.5 14V6M12 14V8M16.5 14V4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    <path d="M1.5 14h15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
);

const AmostraIcon = () => (
  <svg width="20" height="20" viewBox="0 0 18 18" fill="none">
    <path d="M6.5 1v7.5L2.5 14.5A1.5 1.5 0 003.8 17h10.4a1.5 1.5 0 001.3-2.5L11.5 8.5V1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5.5 1h7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
);

const MapIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
    <line x1="8" y1="2" x2="8" y2="18"/>
    <line x1="16" y1="6" x2="16" y2="22"/>
  </svg>
);

const mobileNavItems = [
  {
    label: 'Dashboard',
    href: '/',
    icon: <DashboardIcon />,
    exact: true,
  },
  {
    label: 'Estrutura',
    href: '/estrutura',
    icon: <EstruturaIcon />,
    exact: false,
  },
  {
    label: 'Amostras',
    href: '/amostras',
    icon: <AmostraIcon />,
    exact: false,
  },
  {
    label: 'Mapa',
    href: '/caixas/1/mapa',
    icon: <MapIcon />,
    exact: false,
  },
];

export default function MobileNav() {
  const pathname = usePathname();

  function isActive(href: string, exact: boolean): boolean {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(href + '/');
  }

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-sidebar/95 backdrop-blur-lg border-t border-white/10 px-2 py-1.5 flex items-center justify-around shadow-2xl">
      {mobileNavItems.map((item) => {
        const active = isActive(item.href, item.exact);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`
              flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-150 relative
              ${active
                ? 'text-neo-teal font-bold scale-105'
                : 'text-white/50 hover:text-white'
              }
            `}
          >
            {/* Ícone */}
            <span className={`transition-transform ${active ? 'scale-110' : ''}`}>
              {item.icon}
            </span>

            {/* Label */}
            <span className="text-[10px] tracking-tight">{item.label}</span>

            {/* Indicador de item ativo estilo app (ponto brilhante) */}
            {active && (
              <span className="absolute -top-1 w-1 h-1 rounded-full bg-neo-teal shadow-sm shadow-neo-teal" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
