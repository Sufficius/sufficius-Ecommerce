"use client";

import { useState } from "react";
import { PieChart, ShoppingBag, Tag } from "lucide-react";

export default function CategoryChart() {
  const [periodo, setPeriodo] = useState("mes");
  
  // Dados por categoria
  const dadosCategorias: Record<string, Array<{ nome: string; valor: number; cor: string }>> = {
    hoje: [
      { nome: "Eletrônicos", valor: 18500, cor: "bg-blue-500" },
      { nome: "Moda", valor: 12500, cor: "bg-pink-500" },
      { nome: "Casa", valor: 8900, cor: "bg-green-500" },
      { nome: "Beleza", valor: 6700, cor: "bg-purple-500" },
      { nome: "Outros", valor: 4500, cor: "bg-gray-500" }
    ],
    mes: [
      { nome: "Eletrônicos", valor: 425800, cor: "bg-blue-500" },
      { nome: "Moda", valor: 289500, cor: "bg-pink-500" },
      { nome: "Casa", valor: 198200, cor: "bg-green-500" },
      { nome: "Beleza", valor: 156700, cor: "bg-purple-500" },
      { nome: "Outros", valor: 89500, cor: "bg-gray-500" }
    ],
    ano: [
      { nome: "Eletrônicos", valor: 3850000, cor: "bg-blue-500" },
      { nome: "Moda", valor: 2450000, cor: "bg-pink-500" },
      { nome: "Casa", valor: 1890000, cor: "bg-green-500" },
      { nome: "Beleza", valor: 1250000, cor: "bg-purple-500" },
      { nome: "Outros", valor: 850000, cor: "bg-gray-500" }
    ]
  };

  const categorias = dadosCategorias[periodo];
  const total = categorias.reduce((acc, cat) => acc + cat.valor, 0);

  // Calcular ângulos para o gráfico de pizza
  const calcularAngulos = () => {
    let anguloAcumulado = 0;
    return categorias.map(cat => {
      const porcentagem = (cat.valor / total) * 100;
      const angulo = (porcentagem / 100) * 360;
      const resultado = {
        ...cat,
        porcentagem,
        anguloInicio: anguloAcumulado,
        anguloFim: anguloAcumulado + angulo
      };
      anguloAcumulado += angulo;
      return resultado;
    });
  };

  const dadosComAngulos = calcularAngulos();

  return (
    <div className="h-96">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-2xl font-bold">KZ {total.toLocaleString()}</div>
          <div className="flex items-center text-sm">
            <Tag className="h-4 w-4 text-[#D4AF37] mr-1" />
            <span className="text-gray-600">Vendas por categoria</span>
          </div>
        </div>
        
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
          {["hoje", "mes", "ano"].map((p) => (
            <button
              key={p}
              onClick={() => setPeriodo(p)}
              className={`px-3 py-1 text-sm rounded-md transition ${
                periodo === p
                  ? "bg-white shadow"
                  : "hover:bg-gray-200"
              }`}
            >
              {p === "hoje" ? "Hoje" : p === "mes" ? "Este mês" : "Este ano"}
            </button>
          ))}
        </div>
      </div>

      {/* Gráfico de pizza e legenda lado a lado */}
      <div className="grid lg:grid-cols-2 gap-8 h-64">
        {/* Gráfico de pizza */}
        <div className="relative h-64">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative h-48 w-48">
              {/* Anel externo */}
              <div className="absolute inset-0 rounded-full border-8 border-gray-100"></div>
              
              {/* Fatias da pizza */}
              <svg className="absolute inset-0" viewBox="0 0 100 100">
                {dadosComAngulos.map((cat, index) => {
                  const raio = 40;
                  const x1 = 50 + raio * Math.cos((cat.anguloInicio - 90) * (Math.PI / 180));
                  const y1 = 50 + raio * Math.sin((cat.anguloInicio - 90) * (Math.PI / 180));
                  const x2 = 50 + raio * Math.cos((cat.anguloFim - 90) * (Math.PI / 180));
                  const y2 = 50 + raio * Math.sin((cat.anguloFim - 90) * (Math.PI / 180));
                  
                  const grandeArco = cat.anguloFim - cat.anguloInicio > 180 ? 1 : 0;
                  
                  return (
                    <path
                      key={index}
                      d={`M 50 50 L ${x1} ${y1} A ${raio} ${raio} 0 ${grandeArco} 1 ${x2} ${y2} Z`}
                      fill={cat.cor.replace('bg-', '').replace('-500', '')}
                      fillOpacity="0.8"
                      stroke="white"
                      strokeWidth="2"
                      className="transition-all duration-300 hover:opacity-90 cursor-pointer"
                    //  title={`${String(cat.nome)}: ${String(cat.porcentagem.toFixed(1))}%`}
                    />
                  );
                })}
              </svg>
              
              {/* Centro do gráfico */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-16 w-16 bg-white rounded-full shadow flex items-center justify-center">
                  <PieChart className="h-8 w-8 text-[#D4AF37]" />
                </div>
              </div>
            </div>
          </div>

          {/* Total no centro (opcional) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
            <div className="text-lg font-bold">
              {categorias.length} categorias
            </div>
          </div>
        </div>

        {/* Legenda e detalhes */}
        <div className="space-y-4">
          <h4 className="font-bold text-gray-900">Distribuição por Categoria</h4>
          
          <div className="space-y-3">
            {dadosComAngulos.map((cat, index) => (
              <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className={`h-3 w-3 rounded-full ${cat.cor}`}></div>
                  <div>
                    <div className="font-medium">{cat.nome}</div>
                    <div className="text-sm text-gray-500">
                      {cat.porcentagem.toFixed(1)}% do total
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="font-bold">KZ {cat.valor.toLocaleString()}</div>
                  <div className="text-sm text-gray-500">
                    {periodo === "hoje" ? "hoje" : periodo === "mes" ? "este mês" : "este ano"}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div className="text-center">
              <div className="text-sm text-gray-500">Categoria Top</div>
              <div className="font-bold">{dadosComAngulos[0].nome}</div>
              <div className="text-xs text-gray-500">
                {dadosComAngulos[0].porcentagem.toFixed(1)}% do total
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-500">Variação</div>
              <div className="font-bold text-green-500">+15.2%</div>
              <div className="text-xs text-gray-500">vs. anterior</div>
            </div>
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-center gap-3">
          <ShoppingBag className="h-5 w-5 text-blue-600" />
          <div>
            <div className="font-medium text-blue-900">Insight do Mês</div>
            <div className="text-sm text-blue-700">
              A categoria <strong>{dadosComAngulos[0].nome}</strong> representa{" "}
              <strong>{dadosComAngulos[0].porcentagem.toFixed(1)}%</strong> das vendas totais. 
              Considere aumentar o investimento nesta categoria.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}