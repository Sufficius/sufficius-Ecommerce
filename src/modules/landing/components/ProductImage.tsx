// src/modules/landing/components/ProductImage.tsx
import { SupabaseImage } from "@/components/ui/supabaseImage";
import { Package } from "lucide-react";

export const ProductImage = ({
  produto,
  className = "",
}: {
  produto: any;
  className?: string;
}) => {
  // Fallback personalizado para produtos
  const productFallback = (
    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center">
      <Package className="h-12 w-12 text-gray-400 mb-2" />
      <span className="text-gray-500 text-sm">{produto?.nome}</span>
    </div>
  );

  return (
    <SupabaseImage
      src={produto?.foto}
      alt={produto?.nome}
      bucket="product"
      className={`w-full h-full object-cover ${className}`}
      fallback={productFallback}
    />
  );
};