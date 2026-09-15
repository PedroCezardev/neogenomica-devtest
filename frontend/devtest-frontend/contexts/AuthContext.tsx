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
  // Inicializa o estado lazily a partir do localStorage
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('neo_token');
  });

  const [usuario, setUsuario] = useState<UsuarioState | null>(() => {
    if (typeof window === 'undefined') return null;
    return authService.getStoredUser();
  });

  const [loading] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Redireciona para o login se não houver token ativo e não estiver na página /login
    if (!token && pathname !== '/login') {
      router.push('/login');
    } else if (token) {
      // Sincroniza sempre o perfil do usuário autenticado a partir do endpoint /auth/me
      authService
        .getMe()
        .then((u) => {
          if (u && u.nome) {
            const userData = { id: u.id, nome: u.nome, email: u.email };
            setUsuario(userData);
            localStorage.setItem('neo_usuario', JSON.stringify(userData));
          }
        })
        .catch((err) => {
          if (err?.status === 401 || err?.statusCode === 401) {
            logout();
          }
        });
    }
  }, [token, pathname, router]);

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
