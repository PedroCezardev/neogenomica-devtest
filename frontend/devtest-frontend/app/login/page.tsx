'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { ApiError } from '@/services/api';

export default function LoginPage() {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);

  // Form states
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Status states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (isRegister) {
        if (!nome.trim()) {
          setError('Por favor, informe seu nome.');
          setLoading(false);
          return;
        }
        await authService.register(nome, email, senha);
        setSuccessMsg('Conta criada com sucesso! Faça login para continuar.');
        setIsRegister(false);
        setSenha('');
      } else {
        await authService.login(email, senha);
        router.push('/');
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Ocorreu um erro ao conectar com o servidor.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full bg-content flex items-center justify-center p-4 md:p-8">
      
      {/* Container principal */}
      <div className="w-full max-w-5xl bg-card rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-border/50 animate-scale-in p-3 md:p-4 gap-2 md:gap-4">

        {/* LADO ESQUERDO */}
        <div className="relative w-full md:w-1/2 min-h-[320px] md:min-h-[560px] p-6 md:p-10 flex flex-col justify-between overflow-hidden rounded-2xl md:rounded-3xl shadow-md">

          <Image
            src="/image-login.png"
            alt="NeoGenomica DNA Background"
            fill
            className="object-cover transition-transform duration-700 hover:scale-105"
            priority
          />

          {/* Overlay com gradiente suave */}
          <div className="absolute inset-0 bg-gradient-to-t from-neo-darkest/75 via-neo-darkest/20 to-transparent" />

          {/* Logo da empresa */}
          <div className="relative z-10">
            <div className="relative w-40 h-10">
              <Image
                src="/neogenomica-white.svg"
                alt="NeoGenomica Logo"
                fill
                className="object-contain object-left"
                priority
              />
            </div>
          </div>

          <div className="relative z-10 mt-auto text-white">
            <span className="text-xs font-semibold uppercase tracking-wider text-white py-1 inline-block mb-3">
              Tecnologia & Genética
            </span>
            <h2 className="text-2xl md:text-3xl font-bold leading-tight tracking-tight">
              Gerenciamento inteligente de microtubos de DNA
            </h2>
          </div>
        </div>

        {/* LADO DIREITO */}
        <div
          key={isRegister ? 'register-mode' : 'login-mode'}
          className="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-center bg-card animate-fade-in"
        >

          {/* Cabeçalho do Form */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-text-primary tracking-tight">
              {isRegister ? 'Criar uma conta' : 'Acessar o sistema'}
            </h1>
            <p className="text-sm text-text-muted mt-1">
              {isRegister
                ? 'Preencha os dados abaixo para se cadastrar.'
                : 'Informe seu e-mail e senha para continuar.'}
            </p>
          </div>

          {/* Banners de feedback */}
          {error && (
            <div className="mb-4 p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2 animate-fade-in">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
                <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M8 5v4M8 11h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium flex items-center gap-2 animate-fade-in">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
                <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M5 8l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>{successMsg}</span>
            </div>
          )}

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {isRegister && (
              <Input
                label="Seu nome"
                type="text"
                placeholder="Ex: Ana Silva"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            )}

            <Input
              label="Seu e-mail"
              type="email"
              placeholder="exemplo@neogenomica.com.br"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {/* Campo Senha com botão de ver/ocultar */}
            <div className="relative">
              <Input
                label="Sua senha"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[38px] text-text-muted hover:text-text-primary transition-colors text-xs font-medium"
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M1.5 12s4-8 10.5-8 10.5 8 10.5 8-4 8-10.5 8-10.5-8-10.5-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>

            {/* Botão Submit */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="mt-2 w-full shadow-lg shadow-accent/25 hover:shadow-accent/40"
            >
              {isRegister ? 'Cadastrar' : 'Entrar no Sistema'}
            </Button>
          </form>

          {/* Alternar entre Login e Cadastro */}
          <div className="mt-8 text-center border-t border-border pt-6">
            <p className="text-xs text-text-muted">
              {isRegister ? 'Já possui uma conta?' : 'Ainda não tem conta?'}
              <button
                type="button"
                onClick={() => {
                  setIsRegister(!isRegister);
                  setError(null);
                  setSuccessMsg(null);
                }}
                className="ml-1.5 text-xs font-semibold text-accent hover:text-accent-hover hover:underline transition-all"
              >
                {isRegister ? 'Fazer login' : 'Criar uma conta'}
              </button>
            </p>
          </div>

        </div>
      </div>
    </div>
  );

}
