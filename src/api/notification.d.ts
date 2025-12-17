// Tipos baseados no modelo Prisma de notificações

export type Papel = "CHEFE" | "TECNICO" | "RECEPCIONISTA";

export type PrioridadeNotificacao = "BAIXA" | "NORMAL" | "ALTA" | "CRITICA";

export interface NotificationData {
  id: string;
  titulo: string;
  mensagem: string;
  lida: boolean;
  tipo_destinatario: Papel;
  acao_url?: string;
  prioridade: PrioridadeNotificacao;
  criado_aos: Date | string;
  id_usuario: string;
  usuario?: {
    id: string;
    nome: string;
    email: string;
  };
}

export interface NotificationFilters {
  lida?: boolean;
  prioridade?: PrioridadeNotificacao;
  tipo_destinatario?: Papel;
  dataInicio?: Date;
  dataFim?: Date;
}

export interface NotificationStats {
  total: number;
  naoLidas: number;
  criticas: number;
  altas: number;
  normais: number;
  baixas: number;
}
