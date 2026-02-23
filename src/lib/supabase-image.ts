// src/lib/supabase-image.ts
import { supabaseConfig } from "@/config/supabase";

/**
 * Gera URL pública para imagem no Supabase Storage
 * @param bucket - Nome do bucket (produtos-imagens, categorias-imagens)
 * @param path - Caminho do arquivo
 * @returns URL pública completa
 */
export function getSupabaseImageUrl(bucket: string, path: string): string {
  if (!path) return '';
  
  // Se já for URL completa, retorna como está
  if (path.startsWith('http')) return path;
  
  // Remove barras duplicadas
  const cleanPath = path.replace(/^\/+/, '');
  
  return `${supabaseConfig.storageUrl}/${bucket}/${cleanPath}`;
}

/**
 * Extrai caminho da imagem a partir da URL do Supabase
 * @param url - URL completa da imagem
 * @returns Caminho relativo
 */
export function extractImagePath(url: string): string {
  if (!url) return '';
  
  // Se for URL do Supabase, extrai apenas o caminho
  if (url.includes(supabaseConfig.storageUrl)) {
    return url.replace(`${supabaseConfig.storageUrl}/`, '');
  }
  
  return url;
}

/**
 * Determina qual bucket usar baseado no tipo
 */
export function getBucketForType(type: 'product' | 'category' | 'comprovativo'): string {
  const buckets = {
    product: supabaseConfig.buckets.products,
    category: supabaseConfig.buckets.categories,
    comprovativo: supabaseConfig.buckets.comprovativos
  };
  
  return buckets[type];
}