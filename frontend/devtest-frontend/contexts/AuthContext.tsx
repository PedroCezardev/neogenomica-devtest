'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { authService } from '@/services/auth.service';

interface UsuarioState {
  id: number;
  nome: string;
  email: string;
}

interface AuthContextData {
  usuario: UsuarioState | null;
  token: string | null;
  loading: boolean;
  logout: () => void;
  setAuth: (token: string, usuario: UsuarioState) => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<UsuarioState | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Carrega do localStorage ao iniciar
    const storedToken = localStorage.getItem('neo_token');
    const storedUser = authService.getStoredUser();

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUsuario(storedUser);
    } else {
      // Se não estiver na página de login, redireciona
      if (pathname !== '/login') {
        router.push('/login');
      }
    }
    setLoading(false);
  }, [pathname, router]);

  function setAuth(newToken: string, newUsuario: UsuarioState) {
    setToken(newToken);
    setUsuario(newUsuario);
    localStorage.setItem('neo_token', newToken);
    localStorage.setItem('neo_usuario', JSON.stringify(newUsuario));
  }

  function logout() {
    setToken(null);
    setUsuario(null);
    authService.logout();
  }

  return (
    <AuthContext.Provider
      value={{
        usuario,
        token,
        loading,
        logout,
        setAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
