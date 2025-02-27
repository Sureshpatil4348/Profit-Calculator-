'use client';

import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ProjectionLineChartProps {
  monthlyProjections: {
    month: number;
    value: number;
    profit: number;
  }[];
  initialInvestment: number;
}

export default function ProjectionLineChart({
  monthlyProjections,
  initialInvestment,
}: ProjectionLineChartProps) {
  const labels = monthlyProjections.map((proj) => `Month ${proj.month}`);
  
  const data = {
    labels,
    datasets: [
      {
        label: 'Investment Value',
        data: monthlyProjections.map((proj) => proj.value),
        borderColor: '#CCE3DE', // emerald - updated
        backgroundColor: 'rgba(204, 227, 222, 0.1)', // emerald with opacity - updated
        pointBackgroundColor: '#CCE3DE',
        pointBorderColor: '#1F2421',
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.3,
        fill: true,
        borderWidth: 2,
      },
      {
        label: 'Initial Investment',
        data: Array(monthlyProjections.length).fill(initialInvestment),
        borderColor: '#A4C3B2', // sage - updated
        pointRadius: 0,
        borderWidth: 1,
        borderDash: [5, 5],
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          color: 'rgba(246, 255, 248, 0.1)', // mint with opacity - updated
        },
        ticks: {
          color: '#F6FFF8', // mint - updated
          font: {
            size: 12,
          },
          callback: function(value: any) {
            return `$${value.toLocaleString()}`;
          },
        },
      },
      x: {
        grid: {
          color: 'rgba(246, 255, 248, 0.1)', // mint with opacity - updated
        },
        ticks: {
          color: '#F6FFF8', // mint - updated
          maxRotation: 45,
          minRotation: 45,
          font: {
            size: 12,
          },
        },
      },
    },
    plugins: {
      legend: {
        position: 'top' as const,
        align: 'end' as const,
        labels: {
          color: '#F6FFF8', // mint - updated
          boxWidth: 15,
          padding: 15,
          font: {
            family: 'Inter',
            size: 14,
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(31, 36, 33, 0.8)', // darkBg with opacity
        titleColor: '#F6FFF8', // mint - updated
        bodyColor: '#F6FFF8', // mint - updated
        titleFont: {
          size: 14,
        },
        bodyFont: {
          size: 14,
        },
        padding: 12,
        cornerRadius: 4,
        callbacks: {
          label: function(context: any) {
            if (context.dataset.label === 'Investment Value') {
              const profit = monthlyProjections[context.dataIndex].profit;
              const sign = profit >= 0 ? '+' : '';
              return [
                `Value: $${context.raw.toLocaleString()}`,
                `Profit: ${sign}$${profit.toLocaleString()}`
              ];
            }
            return `${context.dataset.label}: $${context.raw.toLocaleString()}`;
          },
        },
      },
    },
  };

  return (
    <div className="w-full h-full min-h-[400px]">
      <Line data={data} options={options} height={400} />
    </div>
  );
} 