// src/config/supabase.ts
export const supabaseConfig = {
  url: import.meta.env.VITE_SUPABASE_URL || 'https://rojyeqiqrvriknawugmt.supabase.co',
  storageUrl: import.meta.env.VITE_SUPABASE_STORAGE_URL || 'https://rojyeqiqrvriknawugmt.supabase.co/storage/v1/object/public',
  buckets: {
    products: 'produtos-imagens',
    categories: 'categorias-imagens',
    comprovativos: 'sufficius-files'
  }
};