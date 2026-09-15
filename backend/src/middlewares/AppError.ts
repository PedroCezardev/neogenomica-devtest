/**
 * AppError — Erro de negócio controlado
 *
 * Use essa classe para lançar erros esperados com status HTTP específico.
 * Ex: "Sala não encontrada" (404), "Nome já em uso" (409), etc.
 *
 * O errorHandler global vai capturar e formatar corretamente.
 */
export class AppError extends Error {
  public readonly statusCode: number;

  constructor(message: string, statusCode: number = 400) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
  }
}
