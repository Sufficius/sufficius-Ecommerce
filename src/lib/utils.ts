import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-AO', {
    style: 'currency',
    currency: 'AOA',
    minimumFractionDigits: 2
  }).format(value);
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(date);
}

export function formatShortDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date);
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    'ENTREGUE': 'bg-green-100 text-green-800',
    'PROCESSANDO': 'bg-blue-100 text-blue-800',
    'CONFIRMADO': 'bg-yellow-100 text-yellow-800',
    'PREPARANDO': 'bg-orange-100 text-orange-800',
    'ENVIADO': 'bg-purple-100 text-purple-800',
    'PAGAMENTO_PENDENTE': 'bg-red-100 text-red-800',
    'CANCELADO': 'bg-gray-100 text-gray-800',
    'PENDENTE': 'bg-gray-100 text-gray-800'
  };
  
  return colors[status.toUpperCase()] || 'bg-gray-100 text-gray-800';
}

export function getStatusText(status: string): string {
  const statusMap: Record<string, string> = {
    'ENTREGUE': 'Entregue',
    'PROCESSANDO': 'Processando',
    'CONFIRMADO': 'Confirmado',
    'PREPARANDO': 'Preparando',
    'ENVIADO': 'Enviado',
    'PAGAMENTO_PENDENTE': 'Pagamento Pendente',
    'CANCELADO': 'Cancelado',
    'PENDENTE': 'Pendente'
  };
  
  return statusMap[status.toUpperCase()] || status;
}