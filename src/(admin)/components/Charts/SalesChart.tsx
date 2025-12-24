"use client";

import { useState } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function SalesChart() {
  const [periodo, setPeriodo] = useState("7dias");
  
  // Dados de exemplo para vendas
  const dadosVendas: Record<string, { labels: string[], valores: number[] }> = {
    hoje: {
      labels: ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00", "23:59"],
      valores: [1500, 3200, 2800, 4200, 3800, 5200, 4800]
    },
    ontem: {
      labels: ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00", "23:59"],
      valores: [1200, 2800, 3200, 3800, 4200, 4800, 5200]
    },
    "7dias": {
      labels: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"],
      valores: [12500, 18900, 15200, 21800, 19500, 24500, 31200]
    },
    "30dias": {
      labels: ["Sem 1", "Sem 2", "Sem 3", "Sem 4"],
      valores: [48900, 62500, 71200, 84500]
    },
    mes: {
      labels: ["1-7", "8-14", "15-21", "22-28", "29-31"],
      valores: [28900, 42500, 51200, 63500, 28900]
    }
  };

  const dadosAtuais = dadosVendas[periodo] || dadosVendas["7dias"];
  
  // Calcular valores
  const maxValor = Math.max(...dadosAtuais.valores);
  const minValor = Math.min(...dadosAtuais.valores);
  const totalVendas = dadosAtuais.valores.reduce((a, b) => a + b, 0);
  const mediaVendas = Math.round(totalVendas / dadosAtuais.valores.length);
  const crescimento = periodo === "hoje" ? 12.5 : periodo === "7dias" ? 8.2 : 15.7;

  return (
    <div className="h-64">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-2xl font-bold">R$ {totalVendas.toLocaleString()}</div>
          <div className="flex items-center text-sm">
            {crescimento > 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
            )}
            <span className={crescimento > 0 ? "text-green-500" : "text-red-500"}>
              {crescimento > 0 ? "+" : ""}{crescimento}%
            </span>
            <span className="text-gray-500 ml-1">vs. anterior</span>
          </div>
        </div>
        
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
          {["hoje", "7dias", "30dias", "mes"].map((p) => (
            <button
              key={p}
              onClick={() => setPeriodo(p)}
              className={`px-3 py-1 text-sm rounded-md transition ${
                periodo === p
                  ? "bg-white shadow"
                  : "hover:bg-gray-200"
              }`}
            >
              {p === "hoje" ? "Hoje" : 
               p === "7dias" ? "7 dias" : 
               p === "30dias" ? "30 dias" : "Mês"}
            </button>
          ))}
        </div>
      </div>

      {/* Gráfico de barras */}
      <div className="relative h-48">
        {/* Linhas de grid */}
        <div className="absolute inset-0 flex flex-col justify-between">
          {[0, 25, 50, 75, 100].map((percent) => (
            <div key={percent} className="border-t border-gray-200"></div>
          ))}
        </div>

        {/* Barras do gráfico */}
        <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between h-40 px-2">
          {dadosAtuais.valores.map((valor, index) => {
            const alturaPercentual = ((valor - minValor) / (maxValor - minValor)) * 100;
            const alturaReal = Math.max(alturaPercentual * 0.8, 10); // Mínimo 10%
            
            return (
              <div key={index} className="flex flex-col items-center flex-1">
                <div className="relative w-full flex justify-center">
                  {/* Barra */}
                  <div 
                    className="w-3/4 bg-gradient-to-t from-[#D4AF37] to-yellow-300 rounded-t-lg transition-all duration-300 hover:opacity-80 cursor-pointer"
                    style={{ height: `${alturaReal}%` }}
                    title={`R$ ${valor.toLocaleString()}`}
                  >
                    {/* Tooltip na hover */}
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      R$ {valor.toLocaleString()}
                    </div>
                  </div>
                </div>
                
                {/* Label */}
                <div className="mt-2 text-xs text-gray-600 truncate w-full text-center">
                  {dadosAtuais.labels[index]}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legenda */}
        <div className="absolute top-0 right-0 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 bg-gradient-to-t from-[#D4AF37] to-yellow-300 rounded"></div>
            <span className="text-sm text-gray-600">Vendas</span>
          </div>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
        <div className="text-center">
          <div className="text-sm text-gray-500">Média</div>
          <div className="font-bold">R$ {mediaVendas.toLocaleString()}</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-500">Máxima</div>
          <div className="font-bold">R$ {maxValor.toLocaleString()}</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-500">Mínima</div>
          <div className="font-bold">R$ {minValor.toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
}