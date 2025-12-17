import { useState, useEffect } from "react";
import { Chart } from "primereact/chart";

export default function SalesChart() {
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    const textColor = "#374151";
    const textColorSecondary = "#6B7280";
    const surfaceBorder = "#E5E7EB";

    const data = {
      labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
      datasets: [
        {
          label: "Vendas Realizadas",
          backgroundColor: "#3B82F6",
          borderColor: "#2563EB",
          borderWidth: 2,
          borderRadius: 6,
          data: [245, 320, 280, 390, 420, 510, 480, 590, 640, 570, 530, 680],
          fill: true,
          tension: 0.4,
        },
        {
          label: "Meta de Vendas",
          backgroundColor: "rgba(59, 130, 246, 0.1)",
          borderColor: "#10B981",
          borderWidth: 2,
          borderDash: [5, 5],
          data: [300, 350, 400, 450, 500, 550, 600, 650, 700, 650, 600, 750],
          fill: false,
          tension: 0.4,
        },
      ],
    };
    
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          position: 'top' as const,
          labels: {
            color: textColor,
            usePointStyle: true,
            padding: 20,
          },
        },
        tooltip: {
          mode: 'index' as const,
          intersect: false,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: '#ffffff',
          bodyColor: '#ffffff',
          callbacks: {
            label: function(context: any) {
              let label = context.dataset.label || '';
              if (label) {
                label += ': ';
              }
              label += new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(context.parsed.y * 1000);
              return label;
            }
          }
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
            font: {
              weight: 500,
            },
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
        y: {
          beginAtZero: true,
          ticks: {
            color: textColorSecondary,
            callback: function(value: any) {
              return new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(value * 1000);
            }
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
      },
      interaction: {
        mode: 'nearest' as const,
        axis: 'x' as const,
        intersect: false,
      },
    };

    setChartData(data);
    setChartOptions(options);
  }, []);

  return (
    <div className="card">
      <Chart type="line" data={chartData} options={chartOptions} />
    </div>
  );
}