"use client";

import { useState } from "react";
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";

export default function RevenueChart() {
  const [ano, setAno] = useState(2024);
  
  // Dados de receita por mês
  const dadosReceita: Record<number, { meses: string[], valores: number[], meta: number[] }> = {
    2023: {
      meses: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
      valores: [85000, 92000, 105000, 98000, 112000, 125000, 132000, 128000, 145000, 138000, 165000, 210000],
      meta: [80000, 85000, 90000, 95000, 100000, 105000, 110000, 115000, 120000, 125000, 130000, 135000]
    },
    2024: {
      meses: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
      valores: [95000, 105000, 125000, 118000, 135000, 148000, 155000, 162000, 185000, 195000, 245000, 312000],
      meta: [90000, 95000, 100000, 105000, 110000, 115000, 120000, 125000, 130000, 135000, 140000, 145000]
    }
  };

  const dadosAtuais = dadosReceita[ano];
  
  // Calcular estatísticas
  const totalReceita = dadosAtuais.valores.slice(0, new Date().getMonth() + 1).reduce((a, b) => a + b, 0);
  const mediaMensal = Math.round(totalReceita / (new Date().getMonth() + 1));
  const crescimentoAnual = ano === 2024 ? ((totalReceita - dadosReceita[2023].valores.slice(0, new Date().getMonth() + 1).reduce((a, b) => a + b, 0)) / dadosReceita[2023].valores.slice(0, new Date().getMonth() + 1).reduce((a, b) => a + b, 0) * 100).toFixed(1) : "0.0";
  const metaTotal = dadosAtuais.meta.slice(0, new Date().getMonth() + 1).reduce((a, b) => a + b, 0);
  const atingimentoMeta = ((totalReceita / metaTotal) * 100).toFixed(1);

  return (
    <div className="h-64">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-2xl font-bold">R$ {totalReceita.toLocaleString()}</div>
          <div className="flex items-center text-sm">
            <DollarSign className="h-4 w-4 text-[#D4AF37] mr-1" />
            <span className="text-gray-600">Receita acumulada {ano}</span>
          </div>
        </div>
        
        <div className="flex gap-2">
          {[2023, 2024].map((a) => (
            <button
              key={a}
              onClick={() => setAno(a)}
              className={`px-3 py-1 text-sm rounded-lg transition ${
                ano === a
                  ? "bg-[#D4AF37] text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      {/* Gráfico de linha */}
      <div className="relative h-48">
        {/* Linhas de grid */}
        <div className="absolute inset-0 flex flex-col justify-between">
          {[0, 25, 50, 75, 100].map((percent) => (
            <div key={percent} className="border-t border-gray-200"></div>
          ))}
        </div>

        {/* Linha de receita (gráfico de área) */}
        <div className="absolute bottom-0 left-0 right-0 h-40 px-2">
          {/* Área da receita */}
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="revenueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.05" />
              </linearGradient>
            </defs>
            
            {/* Linha da receita */}
            <polyline
              fill="url(#revenueGradient)"
              stroke="#D4AF37"
              strokeWidth="2"
              points={dadosAtuais.valores
                .slice(0, new Date().getMonth() + 1)
                .map((valor, index) => {
                  const x = (index / (new Date().getMonth())) * 100;
                  const y = 100 - ((valor / Math.max(...dadosAtuais.valores)) * 80);
                  return `${x},${y}`;
                })
                .join(' ')}
            />
            
            {/* Linha da meta */}
            <polyline
              fill="none"
              stroke="#4F46E5"
              strokeWidth="1.5"
              strokeDasharray="4,4"
              points={dadosAtuais.meta
                .slice(0, new Date().getMonth() + 1)
                .map((valor, index) => {
                  const x = (index / (new Date().getMonth())) * 100;
                  const y = 100 - ((valor / Math.max(...dadosAtuais.valores)) * 80);
                  return `${x},${y}`;
                })
                .join(' ')}
            />
          </svg>

          {/* Pontos da receita */}
          <div className="absolute inset-0 flex justify-between items-end">
            {dadosAtuais.valores
              .slice(0, new Date().getMonth() + 1)
              .map((valor, index) => {
                // const yPercent = 100 - ((valor / Math.max(...dadosAtuais.valores)) * 80);
                
                return (
                  <div
                    key={index}
                    className="relative"
                    style={{ left: `${(index / (new Date().getMonth())) * 100}%` }}
                  >
                    <div
                      className="h-3 w-3 bg-[#D4AF37] rounded-full border-2 border-white shadow hover:scale-125 transition-transform cursor-pointer"
                      title={`${dadosAtuais.meses[index]}: R$ ${valor.toLocaleString()}`}
                    />
                    
                    {/* Label do mês */}
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-gray-600 whitespace-nowrap">
                      {dadosAtuais.meses[index]}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Legenda */}
        <div className="absolute top-0 right-0 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 bg-[#D4AF37] rounded"></div>
            <span className="text-sm text-gray-600">Receita Real</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 border border-[#4F46E5]"></div>
            <span className="text-sm text-gray-600">Meta</span>
          </div>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
        <div className="text-center">
          <div className="text-sm text-gray-500">Crescimento</div>
          <div className="flex items-center justify-center">
            {Number(crescimentoAnual) > 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
            )}
            <span className={`font-bold ${Number(crescimentoAnual) > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {crescimentoAnual}%
            </span>
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-500">Média Mensal</div>
          <div className="font-bold">R$ {mediaMensal.toLocaleString()}</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-500">Meta</div>
          <div className="font-bold">{atingimentoMeta}%</div>
        </div>
      </div>
    </div>
  );
}