import { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';

export default function CategoryChart() {
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});

    useEffect(() => {
        const data = {
            labels: ['Eletrônicos', 'Moda', 'Casa & Jardim', 'Beleza', 'Esportes', 'Livros'],
            datasets: [
                {
                    data: [35, 25, 15, 10, 8, 7],
                    backgroundColor: [
                        '#3B82F6', // blue-500
                        '#8B5CF6', // purple-500
                        '#10B981', // green-500
                        '#F59E0B', // yellow-500
                        '#EF4444', // red-500
                        '#6B7280'  // gray-500
                    ],
                    hoverBackgroundColor: [
                        '#2563EB', // blue-600
                        '#7C3AED', // purple-600
                        '#059669', // green-600
                        '#D97706', // yellow-600
                        '#DC2626', // red-600
                        '#4B5563'  // gray-600
                    ],
                    borderWidth: 2,
                    borderColor: '#ffffff',
                }
            ]
        };

        const options = {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '60%',
            plugins: {
                legend: {
                    position: 'right' as const,
                    labels: {
                        color: '#374151',
                        usePointStyle: true,
                        padding: 20,
                        font: {
                            size: 12
                        }
                    },
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    callbacks: {
                        label: function (context: any) {
                            return `${context.label}: ${context.parsed}% das vendas`;
                        }
                    }
                }
            }
        };

        setChartData(data);
        setChartOptions(options);
    }, []);

    return (
        <div className="card flex justify-center items-center min-h-[300px] w-full">
            <Chart
                type="doughnut"
                data={chartData}
                options={chartOptions}
                className="w-full max-w-[400px]"
            />
        </div>
    )
}