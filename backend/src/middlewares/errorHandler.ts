import { Request, Response, NextFunction } from 'express';
import { ZodError, ZodIssue } from 'zod';
import { Prisma } from '@prisma/client';
import { AppError } from './AppError';

/**
 * Middleware global de tratamento de erros.
 * Deve ser registrado DEPOIS de todas as rotas no index.ts.
 *
 * Trata 4 tipos de erro:
 *  1. AppError     → erros de negócio (404, 409, 400, etc.)
 *  2. ZodError     → falha de validação do corpo da requisição
 *  3. PrismaError  → erros do banco (duplicidade, referência inválida, etc.)
 *  4. Error genérico → 500 com log no console
 */
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // 1. Erros de negócio (lançados manualmente com AppError)
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ erro: err.message });
    return;
  }

  // 2. Erros de validação Zod
  if (err instanceof ZodError) {
    const detalhes = err.issues.map((e: ZodIssue) => ({
      campo: e.path.join('.'),
      mensagem: e.message,
    }));
    res.status(400).json({
      erro: 'Dados inválidos na requisição',
      detalhes,
    });
    return;
  }

  // 3. Erros conhecidos do Prisma (P2002 = unique, P2025 = not found, etc.)
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    const meta = err.meta as Record<string, unknown> | undefined;
    switch (err.code) {
      case 'P2002':
        res.status(409).json({
          erro: 'Já existe um registro com esse valor. Verifique os campos únicos.',
          campo: meta?.target,
        });
        return;
      case 'P2025':
        res.status(404).json({ erro: 'Registro não encontrado no banco de dados.' });
        return;
      case 'P2003':
        res.status(400).json({
          erro: 'Referência inválida — o registro pai não existe.',
          campo: meta?.field_name,
        });
        return;
      case 'P2014':
        res.status(400).json({
          erro: 'Violação de relação — esse registro está referenciado por outros dados.',
        });
        return;
    }
  }

  // 4. Erro genérico — log e 500
  const message = err instanceof Error ? err.message : String(err);
  console.error('❌ Erro não tratado:', err);
  res.status(500).json({
    erro: 'Erro interno do servidor.',
    detalhe: process.env.NODE_ENV === 'development' ? message : undefined,
  });
}
