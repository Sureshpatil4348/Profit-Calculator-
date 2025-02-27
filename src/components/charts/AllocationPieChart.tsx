'use client';

import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

interface AllocationPieChartProps {
  allocations: {
    strategy: string;
    percentage: number;
    color: string;
  }[];
}

export default function AllocationPieChart({ allocations }: AllocationPieChartProps) {
  const data = {
    labels: allocations.map(item => item.strategy),
    datasets: [
      {
        data: allocations.map(item => item.percentage),
        backgroundColor: allocations.map(item => item.color),
        borderColor: allocations.map(() => '#1F2421'),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#F6FFF8',
          font: {
            family: 'Inter',
            size: 14,
          },
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(31, 36, 33, 0.8)',
        titleColor: '#F6FFF8',
        bodyColor: '#F6FFF8',
        bodyFont: {
          family: 'Inter',
          size: 14,
        },
        titleFont: {
          family: 'Inter',
          weight: 'bold' as const,
          size: 14,
        },
        padding: 12,
        cornerRadius: 4,
        callbacks: {
          label: function(context: any) {
            return `${context.label}: ${context.raw}%`;
          }
        }
      },
    },
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <div className="w-full max-w-md h-[400px]">
        <Pie data={data} options={options} />
      </div>
    </div>
  );
} 