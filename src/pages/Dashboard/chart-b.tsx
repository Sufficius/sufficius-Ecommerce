
"use client";
import React, { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';

export default function DoughnutChart() {
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});

    useEffect(() => {
        const data = {
            labels: ['COVID-19', 'Hemograma', 'HIV', 'Malária', 'Urina', 'Outros'],
            datasets: [
                {
                    data: [85, 120, 45, 65, 95, 40],
                    backgroundColor: [
                        '#EF4444', // red-500
                        '#3B82F6', // blue-500
                        '#10B981', // green-500
                        '#F59E0B', // yellow-500
                        '#8B5CF6', // purple-500
                        '#6B7280'  // gray-500
                    ],
                    hoverBackgroundColor: [
                        '#DC2626', // red-600
                        '#2563EB', // blue-600
                        '#059669', // green-600
                        '#D97706', // yellow-600
                        '#7C3AED', // purple-600
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
                    },
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    callbacks: {
                        label: function (context: any) {
                            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                            const percentage = ((context.parsed / total) * 100).toFixed(1);
                            return `${context.label}: ${context.parsed} exames (${percentage}%)`;
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
