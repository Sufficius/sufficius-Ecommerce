"use client";
import React, { useState, useEffect } from "react";
import { Chart } from "primereact/chart";

export const dynamic = "force-dynamic";

export default function VerticalBarChart() {
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = "#374151";
    const textColorSecondary = "#6B7280";
    const surfaceBorder = "#E5E7EB";

    const data = {
      labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
      datasets: [
        {
          label: "Pedidos de Exames",
          backgroundColor: "#EF4444",
          borderColor: "#DC2626",
          borderWidth: 1,
          data: [120, 145, 180, 165, 195, 210, 185, 220, 240, 200, 190, 175],
        },
        {
          label: "Exames Concluídos",
          backgroundColor: "#10B981",
          borderColor: "#059669",
          borderWidth: 1,
          data: [115, 140, 175, 160, 190, 200, 180, 210, 235, 195, 185, 170],
        },
        {
          label: "Exames em Andamento",
          backgroundColor: "#F59E0B",
          borderColor: "#D97706",
          borderWidth: 1,
          data: [5, 5, 5, 5, 5, 10, 5, 10, 5, 5, 5, 5],
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
        },
      },
      scales: {
        x: {
          stacked: false,
          ticks: {
            color: textColorSecondary,
            font: {
              weight: 500,
            },
          },
          grid: {
            display: false,
            drawBorder: false,
          },
        },
        y: {
          stacked: false,
          beginAtZero: true,
          ticks: {
            color: textColorSecondary,
            callback: function (value: any) {
              return value + ' exames';
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
      <Chart type="bar" data={chartData} options={chartOptions} />
    </div>
  );
}
