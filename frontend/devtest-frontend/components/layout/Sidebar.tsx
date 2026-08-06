'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

// ─── Ícones SVG inline (sem dependência) ─────────────────────────────────
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

// ─── Configuração dos itens de navegação ─────────────────────────────────
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
];

import { useAuth } from '@/contexts/AuthContext';

// ─── Componente principal ─────────────────────────────────────────────────
export default function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  function isActive(href: string, exact: boolean): boolean {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(href + '/');
  }


  return (
    <aside className="w-60 h-screen bg-sidebar fixed left-0 top-0 flex flex-col z-30">

      {/* ── Logo ── */}
      <div className="px-5 py-5 border-b border-white/10">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="relative w-50 h-10">
            <Image
              src="/neogenomica-white.svg"
              alt="NeoGenomica"
              fill
              className="object-contain object-left"
              priority
            />
          </div>
        </Link>
        <p className="text-white/30 text-[10px] mt-2 font-medium tracking-widest uppercase">
          Gestão de Amostras
        </p>
      </div>

      {/* ── Navegação ── */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5 overflow-y-auto">
        <p className="text-white/25 text-[10px] font-semibold tracking-widest uppercase px-3 mb-2">
          Menu
        </p>

        {navItems.map((item) => {
          const active = isActive(item.href, item.exact);
          return (
            <Link
              key={item.href}
              href={item.href}
              id={`nav-${item.label.toLowerCase().replace(/\s+/g, '-').replace('ú', 'u').replace('â', 'a')}`}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                transition-all duration-150 group
                ${active
                  ? 'bg-accent text-white shadow-md shadow-accent/30'
                  : 'text-white/55 hover:text-white hover:bg-white/8'
                }
              `}
            >
              <span className={`transition-transform duration-150 ${active ? '' : 'group-hover:scale-110'}`}>
                {item.icon}
              </span>
              {item.label}

              {/* Indicador visual no item ativo */}
              {active && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/60" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* ── Rodapé ── */}
      <div className="px-3 py-4 border-t border-white/10">
        {/* Card decorativo do sistema */}
        <div className="bg-neo-dark/60 rounded-xl p-4 mb-3 border border-white/8">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-neo-teal animate-pulse" />
            <span className="text-white/80 text-xs font-semibold">Sistema online</span>
          </div>
          <p className="text-white/35 text-[10px] leading-relaxed">
            NeoGenomica Gerenciamento de Amostras v1.0
          </p>
        </div>

        {/* Logout */}
        <button
          id="btn-logout"
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg w-full text-sm font-medium text-white/40 hover:text-white hover:bg-white/8 transition-all duration-150"
        >
          <LogoutIcon />
          Sair do sistema
        </button>
      </div>
    </aside>
  );
}
