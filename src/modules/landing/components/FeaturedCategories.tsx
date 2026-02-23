// src/modules/landing/components/FeaturedCategories.tsx - ATUALIZADO
import { useQuery } from "@tanstack/react-query";
import { categoriaRoutes } from "@/modules/services/api/routes/categorias";
import { CategoryImage } from "./CategoryImage";
import { Loader } from "lucide-react";

export const FeaturedCategories = () => {
  const { data: categorias, isLoading } = useQuery({
    queryKey: ["categorias"],
    queryFn: async () => {
      const response = await categoriaRoutes.getAllCategoria();
      return response;
    },
  });

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <Loader className="h-8 w-8 animate-spin text-[#D4AF37]" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Categorias em Destaque</h2>
          <p className="text-gray-600">
            Navegue por nossas principais categorias
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categorias?.map((cat) => (
            <div key={cat.id} className="group cursor-pointer">
              <div className="h-32 rounded-xl overflow-hidden mb-4 group-hover:scale-105 transition duration-300">
                <CategoryImage
                  category={cat.nome}
                  imageUrl={cat.imagem} // Agora vem do Supabase
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center">
                <h3 className="font-semibold">{cat.nome}</h3>
                <p className="text-sm text-gray-500">
                  {cat.Produto?.length || 0} produtos
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};