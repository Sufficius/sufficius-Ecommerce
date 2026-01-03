"use client";

import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, Loader2, BarChart3, Info } from "lucide-react";

interface SalesChartProps {
  periodo: string;
  dados?: any;
  onPeriodChange?: (periodo: string) => void;
}

interface VendaDiaria {
  data: string;
  totalVendas: number;
  totalPedidos: number;
  ticketMedio?: number;
}

export default function SalesChart({ periodo, dados, onPeriodChange }: SalesChartProps) {
  const [dadosVendas, setDadosVendas] = useState<VendaDiaria[]>([]);
  const [loading, setLoading] = useState(false);
  const [dadosReais, setDadosReais] = useState(false);
  const [detalhesVisiveis, setDetalhesVisiveis] = useState(false);

  useEffect(() => {
    const processarDados = async () => {
      setLoading(true);
      
      try {
        // Se receber dados da API
        if (dados && dados.pedidos && dados.pedidos.length > 0) {
          setDadosReais(true);
          const vendasProcessadas = processarDadosReais(dados.pedidos, periodo);
          setDadosVendas(vendasProcessadas);
        } else {
          // Usar dados mock
          setDadosReais(false);
          setDadosVendas(gerarDadosMock(periodo));
        }
      } catch (error) {
        console.error("Erro ao processar dados:", error);
        setDadosVendas(gerarDadosMock(periodo));
      } finally {
        setLoading(false);
      }
    };

    processarDados();
  }, [periodo, dados]);

  const processarDadosReais = (pedidos: any[], periodoSelecionado: string): VendaDiaria[] => {
    if (!pedidos || pedidos.length === 0) return [];

    // Converter datas e agrupar
    const pedidosComData = pedidos.map(pedido => ({
      ...pedido,
      dataObj: new Date(pedido.criadoEm),
      dataFormatada: formatarDataParaPeriodo(new Date(pedido.criadoEm), periodoSelecionado)
    }));

    // Agrupar por data formatada
    const agrupado: Record<string, { vendas: number, pedidos: number, totalItens: number }> = {};
    
    pedidosComData.forEach(pedido => {
      const chave = pedido.dataFormatada;
      
      if (!agrupado[chave]) {
        agrupado[chave] = { vendas: 0, pedidos: 0, totalItens: 0 };
      }
      
      agrupado[chave].vendas += Number(pedido.total) || 0;
      agrupado[chave].pedidos += 1;
      agrupado[chave].totalItens += pedido.itens || 1;
    });

    // Converter para array e calcular ticket médio
    const resultado = Object.entries(agrupado).map(([data, info]) => ({
      data,
      totalVendas: info.vendas,
      totalPedidos: info.pedidos,
      ticketMedio: info.pedidos > 0 ? info.vendas / info.pedidos : 0
    }));

    // Ordenar por data
    return resultado.sort((a, b) => {
      const dataA = extrairData(a.data, periodoSelecionado);
      const dataB = extrairData(b.data, periodoSelecionado);
      return dataA.getTime() - dataB.getTime();
    });
  };

  const formatarDataParaPeriodo = (data: Date, periodo: string): string => {
    switch (periodo) {
      case "hoje":
        return `${data.getHours().toString().padStart(2, '0')}:00`;
      
      case "7dias":
      case "30dias":
        return data.toLocaleDateString('pt-BR', { 
          weekday: 'short',
          day: '2-digit',
          month: 'short' 
        }).replace('.', '');
      
      case "mes":
        const dia = data.getDate();
        if (dia >= 1 && dia <= 7) return "1-7";
        if (dia >= 8 && dia <= 14) return "8-14";
        if (dia >= 15 && dia <= 21) return "15-21";
        if (dia >= 22 && dia <= 28) return "22-28";
        return "29-31";
      
      default:
        return data.toLocaleDateString('pt-BR', { weekday: 'short' });
    }
  };

  const extrairData = (dataString: string, periodo: string): Date => {
    // const agora = new Date();
    
    switch (periodo) {
      case "hoje":
        const [hora] = dataString.split(':');
        const data = new Date();
        data.setHours(parseInt(hora), 0, 0, 0);
        return data;
      
      default:
        return new Date();
    }
  };

  const gerarDadosMock = (periodoSelecionado: string): VendaDiaria[] => {
    const dados: VendaDiaria[] = [];
    // const agora = new Date();

    // Base de crescimento para parecer realista
    const baseVendas = periodoSelecionado === "hoje" ? 1000 : 5000;
    const variacao = periodoSelecionado === "hoje" ? 3000 : 15000;

    switch (periodoSelecionado) {
      case "hoje":
        // 8 períodos de 3 horas
        for (let i = 0; i < 8; i++) {
          const hora = i * 3;
          const vendas = baseVendas + Math.sin(i * 0.5) * variacao + Math.random() * 1000;
          const pedidos = Math.floor(vendas / 250);
          
          dados.push({
            data: `${hora.toString().padStart(2, '0')}:00`,
            totalVendas: Math.max(500, vendas),
            totalPedidos: Math.max(2, pedidos),
            ticketMedio: vendas / Math.max(1, pedidos)
          });
        }
        break;

      case "7dias":
        // Últimos 7 dias
        const diasSemana = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
        for (let i = 0; i < 7; i++) {
          const vendas = baseVendas + (i * 2000) + Math.random() * 3000;
          const pedidos = Math.floor(vendas / 300);
          
          dados.push({
            data: diasSemana[i],
            totalVendas: Math.max(1000, vendas),
            totalPedidos: Math.max(5, pedidos),
            ticketMedio: vendas / Math.max(1, pedidos)
          });
        }
        break;

      case "30dias":
        // 4 semanas
        for (let i = 1; i <= 4; i++) {
          const vendas = baseVendas * 3 + (i * 5000) + Math.random() * 8000;
          const pedidos = Math.floor(vendas / 350);
          
          dados.push({
            data: `Sem ${i}`,
            totalVendas: Math.max(5000, vendas),
            totalPedidos: Math.max(15, pedidos),
            ticketMedio: vendas / Math.max(1, pedidos)
          });
        }
        break;

      case "mes":
        // 5 semanas do mês
        const semanas = ["1-7", "8-14", "15-21", "22-28", "29-31"];
        semanas.forEach((semana, i) => {
          const vendas = baseVendas * 2 + (i * 4000) + Math.random() * 6000;
          const pedidos = Math.floor(vendas / 320);
          
          dados.push({
            data: semana,
            totalVendas: Math.max(3000, vendas),
            totalPedidos: Math.max(10, pedidos),
            ticketMedio: vendas / Math.max(1, pedidos)
          });
        });
        break;
    }

    return dados;
  };

  // Calcular estatísticas
  const totalVendas = dadosVendas.reduce((sum, venda) => sum + venda.totalVendas, 0);
  const totalPedidos = dadosVendas.reduce((sum, venda) => sum + venda.totalPedidos, 0);
  const maxValor = dadosVendas.length > 0 ? Math.max(...dadosVendas.map(v => v.totalVendas)) : 0;
  const minValor = dadosVendas.length > 0 ? Math.min(...dadosVendas.map(v => v.totalVendas)) : 0;
  const mediaVendas = dadosVendas.length > 0 ? totalVendas / dadosVendas.length : 0;
  // const mediaPedidos = dadosVendas.length > 0 ? totalPedidos / dadosVendas.length : 0;
  const ticketMedioGlobal = totalPedidos > 0 ? totalVendas / totalPedidos : 0;

  
  const calcularCrescimentoMock = (periodoSelecionado: string): number => {
    const crescimentos: Record<string, number> = {
      "hoje": 12.5,
      "7dias": 8.2,
      "30dias": 15.7,
      "mes": 10.3
    };
    return crescimentos[periodoSelecionado] || 8.2;
  };
  const crescimento = calcularCrescimentoMock(periodo);

  const handlePeriodoClick = (novoPeriodo: string) => {
    if (onPeriodChange) {
      onPeriodChange(novoPeriodo);
    }
  };

  if (loading) {
    return (
      <div className="h-64 flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#D4AF37] mb-4" />
        <p className="text-gray-600">Processando dados do gráfico...</p>
        <p className="text-sm text-gray-500 mt-1">{dadosReais ? "Dados reais" : "Carregando dados demonstrativos"}</p>
      </div>
    );
  }

  return (
    <div className="h-64">
      {/* Cabeçalho */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-[#D4AF37]" />
            <h3 className="font-semibold">Vendas por Período</h3>
            {!dadosReais && (
              <div className="flex items-center gap-1 text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded">
                <Info className="h-3 w-3" />
                <span>Dados demonstrativos</span>
              </div>
            )}
          </div>
          <div className="text-2xl font-bold mt-2">KZ {totalVendas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
          <div className="flex items-center text-sm mt-1">
            {crescimento > 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
            )}
            <span className={crescimento > 0 ? "text-green-500 font-medium" : "text-red-500 font-medium"}>
              {crescimento > 0 ? "+" : ""}{crescimento}%
            </span>
            <span className="text-gray-500 ml-1">vs. período anterior</span>
          </div>
        </div>
        
        {/* Filtros de período */}
        <div className="flex flex-col items-end gap-2">
          <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
            {["hoje", "7dias", "30dias", "mes"].map((p) => (
              <button
                key={p}
                onClick={() => handlePeriodoClick(p)}
                className={`px-3 py-1 text-xs rounded-md transition-all ${
                  periodo === p
                    ? "bg-white shadow-sm font-medium"
                    : "hover:bg-gray-200 text-gray-600"
                }`}
              >
                {p === "hoje" ? "Hoje" : 
                 p === "7dias" ? "7 dias" : 
                 p === "30dias" ? "30 dias" : "Mês"}
              </button>
            ))}
          </div>
          <button
            onClick={() => setDetalhesVisiveis(!detalhesVisiveis)}
            className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
          >
            {detalhesVisiveis ? "Ocultar detalhes" : "Ver detalhes"}
          </button>
        </div>
      </div>

      {/* Gráfico */}
      <div className="relative h-48">
        {/* Grade de fundo */}
        <div className="absolute inset-0 flex flex-col justify-between">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="border-t border-gray-100"></div>
          ))}
        </div>

        {/* Barras */}
        {dadosVendas.length > 0 ? (
          <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between h-40 px-2">
            {dadosVendas.map((venda, index) => {
              const alturaPercentual = maxValor > 0 ? 
                ((venda.totalVendas - minValor) / (maxValor - minValor)) * 100 : 50;
              const alturaReal = Math.max(alturaPercentual * 0.85, 15);
              const corBarra = venda.totalVendas >= mediaVendas ? 
                "bg-gradient-to-t from-[#D4AF37] to-amber-300" : 
                "bg-gradient-to-t from-amber-200 to-yellow-100";
              
              return (
                <div key={index} className="flex flex-col items-center flex-1 group relative">
                  {/* Barra */}
                  <div className="relative w-10/12 flex justify-center">
                    <div 
                      className={`w-full ${corBarra} rounded-t-lg transition-all duration-300 hover:opacity-90 cursor-pointer shadow-sm`}
                      style={{ height: `${alturaReal}%` }}
                    >
                      {/* Tooltip */}
                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity z-20 min-w-[140px] shadow-lg">
                        <div className="font-bold mb-1">{venda.data}</div>
                        <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                          <span className="text-gray-300">Vendas:</span>
                          <span className="font-medium text-right">KZ {venda.totalVendas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                          <span className="text-gray-300">Pedidos:</span>
                          <span className="font-medium text-right">{venda.totalPedidos}</span>
                          <span className="text-gray-300">Ticket Médio:</span>
                          <span className="font-medium text-right">KZ {venda.ticketMedio?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || "0.00"}</span>
                        </div>
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full border-4 border-transparent border-t-gray-900"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Label */}
                  <div className="mt-2 text-xs text-gray-600 font-medium truncate w-full text-center">
                    {venda.data}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-4xl mb-2">📊</div>
            <p className="text-gray-500 font-medium">Sem dados disponíveis</p>
            <p className="text-sm text-gray-400 mt-1">Nenhuma venda registrada no período</p>
          </div>
        )}

        {/* Linha da média */}
        {dadosVendas.length > 0 && detalhesVisiveis && (
          <div 
            className="absolute left-0 right-0 border-t-2 border-dashed border-gray-300"
            style={{ bottom: `${(mediaVendas / maxValor) * 80}%` }}
          >
            <div className="absolute -top-6 right-0 text-xs text-gray-500 bg-white px-2 py-1 rounded shadow-sm">
              Média: KZ {mediaVendas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </div>
        )}
      </div>

      {/* Estatísticas detalhadas */}
      {detalhesVisiveis && (
        <div className="mt-6 pt-4 border-t">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-xs text-gray-500 uppercase tracking-wide">Total Vendas</div>
              <div className="font-bold text-lg">KZ {totalVendas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-xs text-gray-500 uppercase tracking-wide">Total Pedidos</div>
              <div className="font-bold text-lg">{totalPedidos}</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-xs text-gray-500 uppercase tracking-wide">Ticket Médio</div>
              <div className="font-bold text-lg">KZ {ticketMedioGlobal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-xs text-gray-500 uppercase tracking-wide">Período</div>
              <div className="font-bold text-lg">
                {periodo === "hoje" ? "Hoje" : 
                 periodo === "7dias" ? "Últimos 7 dias" : 
                 periodo === "30dias" ? "Últimos 30 dias" : "Este mês"}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}