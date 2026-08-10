'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';

// Ícones SVG inline
const DashboardIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <rect x="1" y="1" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
    <rect x="10" y="1" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
    <rect x="1" y="10" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
    <rect x="10" y="10" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);

const EstruturIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M3 14V9.5M7.5 14V6M12 14V8M16.5 14V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M1.5 14h15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const AmostraIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M6.5 1v7.5L2.5 14.5A1.5 1.5 0 003.8 17h10.4a1.5 1.5 0 001.3-2.5L11.5 8.5V1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5.5 1h7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="8" cy="13" r="1" fill="currentColor" opacity="0.7"/>
    <circle cx="11" cy="11" r="0.8" fill="currentColor" opacity="0.5"/>
  </svg>
);

const LogoutIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M7 15H3a1 1 0 01-1-1V4a1 1 0 011-1h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M12 12.5L15.5 9 12 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7 9h8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const MapIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
    <line x1="8" y1="2" x2="8" y2="18"/>
    <line x1="16" y1="6" x2="16" y2="22"/>
  </svg>
);

const ChevronLeftIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

// Configuração dos itens de navegação
const navItems = [
  {
    label: 'Dashboard',
    href: '/',
    icon: <DashboardIcon />,
    exact: true,
  },
  {
    label: 'Estrutura Física',
    href: '/estrutura',
    icon: <EstruturIcon />,
    exact: false,
  },
  {
    label: 'Amostras',
    href: '/amostras',
    icon: <AmostraIcon />,
    exact: false,
  },
  {
    label: 'Mapa Visual',
    href: '/caixas/1/mapa',
    icon: <MapIcon />,
    exact: false,
  },
];

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

export default function Sidebar({ collapsed = false, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { logout } = useAuth();

  function isActive(href: string, exact: boolean): boolean {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(href + '/');
  }

  return (
    <aside
      className={`hidden md:flex ${
        collapsed ? 'w-[72px]' : 'w-60'
      } h-screen bg-sidebar fixed left-0 top-0 flex-col z-30 transition-all duration-300 border-r border-white/10`}
    >
      {/* Botão flutuante para expandir e diminuir o menu */}
      {onToggle && (
        <button
          onClick={onToggle}
          type="button"
          aria-label={collapsed ? 'Expandir menu' : 'Recolher menu'}
          title={collapsed ? 'Expandir menu' : 'Recolher menu'}
          className="absolute -right-3.5 top-6 z-40 w-7 h-7 rounded-full bg-neo-darker border border-white/20 text-white/80 hover:text-white flex items-center justify-center shadow-lg hover:bg-neo-teal hover:border-neo-teal transition-all duration-200 cursor-pointer"
        >
          {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </button>
      )}

      {/* Header com Logo */}
      <div className={`py-5 border-b border-white/10 ${collapsed ? 'px-2 text-center' : 'px-5'}`}>
        <Link href="/" className="flex items-center justify-center">
          {collapsed ? (
            <div className="relative w-8 h-8 transition-all">
              <Image
                src="/favicon.svg"
                alt="NeoGenomica"
                fill
                className="object-contain"
                priority
              />
            </div>
          ) : (
            <div className="relative w-48 h-10 transition-all">
              <Image
                src="/neogenomica-white.svg"
                alt="NeoGenomica"
                fill
                className="object-contain object-left"
                priority
              />
            </div>
          )}
        </Link>
        {!collapsed && (
          <p className="text-white/30 text-[10px] mt-2 font-medium tracking-widest uppercase">
            Gestão de Amostras
          </p>
        )}
      </div>

      {/* Menu de Navegação */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
        {!collapsed && (
          <p className="text-white/25 text-[10px] font-semibold tracking-widest uppercase px-3 mb-2">
            Menu
          </p>
        )}

        {navItems.map((item) => {
          const active = isActive(item.href, item.exact);
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              id={`nav-${item.label.toLowerCase().replace(/\s+/g, '-').replace('ú', 'u').replace('â', 'a')}`}
              className={`
                flex items-center rounded-lg text-sm font-medium
                transition-all duration-150 group
                ${collapsed ? 'justify-center p-3' : 'gap-3 px-3 py-2.5'}
                ${
                  active
                    ? 'bg-accent text-white shadow-md shadow-accent/30'
                    : 'text-white/55 hover:text-white hover:bg-white/8'
                }
              `}
            >
              <span className={`shrink-0 transition-transform duration-150 ${active ? '' : 'group-hover:scale-110'}`}>
                {item.icon}
              </span>
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Rodapé do Sidebar */}
      <div className="px-3 py-4 border-t border-white/10">
        {/* Status do sistema */}
        {!collapsed ? (
          <div className="bg-neo-dark/60 rounded-xl p-4 mb-3 border border-white/8">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-white/80 text-xs font-semibold">Sistema online</span>
            </div>
            <p className="text-white/35 text-[10px] leading-relaxed">
              NeoGenomica Gerenciamento v1.0
            </p>
          </div>
        ) : (
          <div className="flex justify-center mb-3" title="Sistema online v1.0">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
        )}

        {/* Botão Sair */}
        <button
          id="btn-logout"
          onClick={logout}
          title={collapsed ? 'Sair do sistema' : undefined}
          className={`flex items-center rounded-lg w-full text-sm font-medium text-white/40 hover:text-white hover:bg-white/8 transition-all duration-150 ${
            collapsed ? 'justify-center p-3' : 'gap-3 px-3 py-2.5'
          }`}
        >
          <LogoutIcon />
          {!collapsed && <span>Sair do sistema</span>}
        </button>
      </div>
    </aside>
  );
}
