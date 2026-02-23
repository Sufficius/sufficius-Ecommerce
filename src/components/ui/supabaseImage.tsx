// src/components/ui/SupabaseImage.tsx
import { useState } from "react";
import { Package } from "lucide-react";
import { getSupabaseImageUrl } from "@/lib/supabase-image";

interface SupabaseImageProps {
  src?: string;
  alt: string;
  bucket?: 'product' | 'category' | 'comprovativo';
  width?: number;
  height?: number;
  className?: string;
  loading?: "lazy" | "eager";
  priority?: boolean;
  fallback?: React.ReactNode;
}

export const SupabaseImage = ({
  src,
  alt,
  bucket = 'product',
  width = 800,
  height = 600,
  className = "",
  loading = "lazy",
  priority = false,
  fallback
}: SupabaseImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);

  // Gerar URL completa da imagem
  const imageUrl = src ? getSupabaseImageUrl(
    bucket === 'product' ? 'produtos-imagens' : 
    bucket === 'category' ? 'categorias-imagens' : 
    'sufficius-files',
    src
  ) : '';

  if (!src || isError) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        {fallback || (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <Package className="h-12 w-12 text-gray-400" />
            <span className="ml-2 text-gray-500 text-sm">{alt}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div
        className={`absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 transition-opacity duration-500 ${
          isLoaded ? "opacity-0" : "opacity-100"
        }`}
      />

      <img
        src={imageUrl}
        alt={alt}
        loading={priority ? "eager" : loading}
        width={width}
        height={height}
        onLoad={() => setIsLoaded(true)}
        onError={() => setIsError(true)}
        className={`w-full h-full object-cover transition-opacity duration-500 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
};