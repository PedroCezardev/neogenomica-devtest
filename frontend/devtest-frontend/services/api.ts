/**
 * services/api.ts
 * Camada base de comunicação com o backend NeoGenomica.
 *
 * Todos os services importam daqui:
 *   - get<T>(endpoint)
 *   - post<T>(endpoint, body)
 *   - put<T>(endpoint, body)
 *   - del(endpoint)
 *   - upload<T>(endpoint, formData)   ← para importação CSV
 */

import { ApiErrorBody } from '@/types';

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';

// ─── Classe de erro da API ────────────────────────────────────────────────
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly detalhes?: ApiErrorBody['detalhes']
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// ─── Helpers internos ─────────────────────────────────────────────────────

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('neo_token');
}

function buildHeaders(includeAuth = true): HeadersInit {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (includeAuth) {
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (res.status === 204) return null as T; // No Content — DELETE bem-sucedido

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const body = data as ApiErrorBody | null;
    throw new ApiError(
      res.status,
      body?.erro ?? `Erro ${res.status}`,
      body?.detalhes
    );
  }

  return data as T;
}

// ─── Funções públicas ─────────────────────────────────────────────────────

export async function get<T>(
  endpoint: string,
  params?: Record<string, string | number | undefined>
): Promise<T> {
  let url = `${BASE_URL}${endpoint}`;

  // Monta query string a partir dos params, ignorando undefined
  if (params) {
    const query = Object.entries(params)
      .filter(([, v]) => v !== undefined && v !== '')
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
      .join('&');
    if (query) url += `?${query}`;
  }

  const res = await fetch(url, {
    method: 'GET',
    headers: buildHeaders(),
  });

  return handleResponse<T>(res);
}

export async function post<T>(endpoint: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: buildHeaders(),
    body: JSON.stringify(body),
  });

  return handleResponse<T>(res);
}

export async function put<T>(endpoint: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'PUT',
    headers: buildHeaders(),
    body: JSON.stringify(body),
  });

  return handleResponse<T>(res);
}

export async function del(endpoint: string): Promise<void> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'DELETE',
    headers: buildHeaders(),
  });

  await handleResponse<void>(res);
}

/** Upload de arquivo — não define Content-Type (o browser inclui o boundary automaticamente) */
export async function upload<T>(
  endpoint: string,
  formData: FormData
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'POST',
    headers,
    body: formData,
  });

  return handleResponse<T>(res);
}
