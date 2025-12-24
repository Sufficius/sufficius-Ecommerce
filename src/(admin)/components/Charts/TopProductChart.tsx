"use client";

import { useState } from "react";
import { TrendingUp, Package } from "lucide-react";

interface Produto {
  nome: string;
  vendas: number;
  estoque: number;
  categoria?: string;
}

interface TopProductsChartProps {
  produtos: Produto[];
}

export default function TopProductsChart({ produtos }: TopProductsChartProps) {
  const [visualizacao, setVisualizacao] = useState<"vendas" | "estoque">("vendas");
  
  // Ordenar produtos
  const produtosOrdenados = [...produtos].sort((a, b) => 
    visualizacao === "vendas" ? b.vendas - a.vendas : b.estoque - a.estoque
  ).slice(0, 5);

  // Calcular valores máximos para normalização
  const maxVendas = Math.max(...produtosOrdenados.map(p => p.vendas));
  const maxEstoque = Math.max(...produtosOrdenados.map(p => p.estoque));

  // Cores para as barras
  const cores = [
    "bg-gradient-to-r from-[#D4AF37] to-yellow-400",
    "bg-gradient-to-r from-blue-500 to-blue-400",
    "bg-gradient-to-r from-green-500 to-green-400",
    "bg-gradient-to-r from-purple-500 to-purple-400",
    "bg-gradient-to-r from-red-500 to-red-400"
  ];

  return (
    <div>
      {/* Controles */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-bold text-lg">Top Produtos</h3>
          <p className="text-sm text-gray-600">
            {visualizacao === "vendas" ? "Por número de vendas" : "Por quantidade em estoque"}
          </p>
        </div>
        
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setVisualizacao("vendas")}
            className={`px-3 py-1 text-sm rounded-md transition ${
              visualizacao === "vendas"
                ? "bg-white shadow"
                : "hover:bg-gray-200"
            }`}
          >
            Vendas
          </button>
          <button
            onClick={() => setVisualizacao("estoque")}
            className={`px-3 py-1 text-sm rounded-md transition ${
              visualizacao === "estoque"
                ? "bg-white shadow"
                : "hover:bg-gray-200"
            }`}
          >
            Estoque
          </button>
        </div>
      </div>

      {/* Lista de produtos */}
      <div className="space-y-4">
        {produtosOrdenados.map((produto, index) => {
          const valor = visualizacao === "vendas" ? produto.vendas : produto.estoque;
          const maxValor = visualizacao === "vendas" ? maxVendas : maxEstoque;
          const percentual = (valor / maxValor) * 100;
          
          return (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 flex items-center justify-center rounded-lg bg-gray-100">
                    <Package className="h-4 w-4 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{produto.nome}</div>
                    <div className="text-sm text-gray-500">
                      {visualizacao === "vendas" 
                        ? `${produto.estoque} em estoque` 
                        : `${produto.vendas} vendas`}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="font-bold">
                    {valor.toLocaleString()}
                  </div>
                  {visualizacao === "vendas" && (
                    <div className="flex items-center text-green-500 text-sm">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      <span>+{Math.round((valor / maxValor) * 20)}%</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Barra de progresso */}
              <div className="relative">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${cores[index]} transition-all duration-500`}
                    style={{ width: `${percentual}%` }}
                  />
                </div>
                
                {/* Marcadores */}
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0</span>
                  <span>{(maxValor / 2).toLocaleString()}</span>
                  <span>{maxValor.toLocaleString()}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Estatísticas totais */}
      <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-500">Total Vendas</div>
          <div className="text-xl font-bold text-[#D4AF37]">
            {produtosOrdenados.reduce((acc, p) => acc + p.vendas, 0).toLocaleString()}
          </div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-500">Total Estoque</div>
          <div className="text-xl font-bold text-blue-600">
            {produtosOrdenados.reduce((acc, p) => acc + p.estoque, 0).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Ranking */}
      <div className="mt-4">
        <div className="text-sm font-medium text-gray-700 mb-2">Ranking:</div>
        <div className="flex flex-wrap gap-2">
          {produtosOrdenados.slice(0, 3).map((produto, index) => (
            <div key={index} className="flex items-center gap-2 bg-white border rounded-lg px-3 py-2">
              <div className={`h-6 w-6 rounded-full flex items-center justify-center ${
                index === 0 ? 'bg-yellow-100 text-yellow-800' :
                index === 1 ? 'bg-gray-100 text-gray-800' :
                'bg-orange-100 text-orange-800'
              }`}>
                {index + 1}
              </div>
              <span className="font-medium">{produto.nome}</span>
              <span className="text-sm text-gray-500">
                ({produto.vendas} vendas)
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}