// Estrutura Física

export interface Sala {
  id: number;
  nome: string;
  criadoEm: string;
  atualizadoEm: string;
  freezers?: Freezer[];
  _count?: { freezers: number };
}

export interface Freezer {
  id: number;
  nome: string;
  salaId: number;
  maxGavetas: number | null;
  criadoEm: string;
  atualizadoEm: string;
  sala?: Sala;
  gavetas?: Gaveta[];
  _count?: { gavetas: number };
}

export interface Gaveta {
  id: number;
  nome: string;
  freezerId: number;
  maxCaixas: number | null;
  criadoEm: string;
  atualizadoEm: string;
  freezer?: Freezer;
  caixas?: Caixa[];
  _count?: { caixas: number };
}

export interface Caixa {
  id: number;
  nome: string;
  gavetaId: number;
  linhas: number;
  colunas: number;
  criadoEm: string;
  atualizadoEm: string;
  gaveta?: Gaveta;
  amostras?: Amostra[];
  _count?: { amostras: number };
}

// Amostra 

export interface Amostra {
  id: number;
  codigoAmostra: string | null;
  pacienteNome: string;
  concentracaoNgUl: number | null;
  material: string;
  exame: string | null;
  observacao: string | null;
  posicao: string;
  caixaId: number;
  criadoEm: string;
  atualizadoEm: string;
  caixa?: Caixa;
}

// Filtros para listagem de amostras
export interface AmostraFiltros {
  busca?: string;
  codigoAmostra?: string;
  pacienteNome?: string;
  material?: string;
  exame?: string;
  caixaId?: number;
}

// Auth

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  criadoEm: string;
}

export interface AuthResponse {
  token: string;
  usuario: {
    id: number;
    nome: string;
    email: string;
  };
}

// First-Fit

export type SugestaoResponse =
  | {
      encontrou: true;
      posicao: string;
      caixaId: number;
      caminho: string;
      totalLivres: number;
      caixa: Caixa;
    }
  | {
      encontrou: false;
      mensagem: string;
      sugestaoGaveta: Gaveta | null;
    };

// Mapa da Caixa

export interface CelulaMapa {
  posicao: string;
  livre: boolean;
  amostra: {
    id: number;
    codigoAmostra: string | null;
    pacienteNome: string;
    material: string;
    concentracaoNgUl: number | null;
    exame: string | null;
  } | null;
}

export interface MapaCaixa {
  caixa: Pick<Caixa, 'id' | 'nome' | 'linhas' | 'colunas'>;
  caminho: string;
  resumo: {
    totalPosicoes: number;
    posicoesOcupadas: number;
    posicoesLivres: number;
    percentualOcupado: number;
  };
  grade: CelulaMapa[];
}

// Importação CSV

export interface ImportacaoResult {
  mensagem: string;
  total: number;
  importadas: number;
  ignoradas: number;
  erros: Array<{ linha: number; motivo: string }>;
}

// Erros da API

export interface ApiErrorBody {
  erro: string;
  detalhes?: Array<{ campo: string; mensagem: string }>;
}
