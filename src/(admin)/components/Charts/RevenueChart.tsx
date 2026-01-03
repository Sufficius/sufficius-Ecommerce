// components/Charts/RevenueChart.tsx
interface RevenueChartProps {
  dados?: any;
}

export default function RevenueChart({ dados }: RevenueChartProps) {
  // Usar dados reais se disponíveis
  return (
    <div className="h-80">
      {/* Implemente seu gráfico aqui com dados reais */}
      <div className="flex items-center justify-center h-full text-gray-500">
        Gráfico de receita - {dados ? 'Dados reais' : 'Dados mock'}
      </div>
    </div>
  );
}