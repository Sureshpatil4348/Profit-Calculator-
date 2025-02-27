'use client';

import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface StrategyData {
  name: string;
  monthlyReturn: number;
  projectedProfit: number;
  color: string;
  pairs?: {
    name: string;
    contribution: number;
  }[];
}

interface StrategyBarChartProps {
  strategies: StrategyData[];
}

export default function StrategyBarChart({ strategies }: StrategyBarChartProps) {
  const data = {
    labels: strategies.map(strategy => strategy.name),
    datasets: [
      {
        label: 'Monthly Return (%)',
        data: strategies.map(strategy => strategy.monthlyReturn),
        backgroundColor: strategies.map(strategy => `${strategy.color}99`), // with opacity
        borderColor: strategies.map(strategy => strategy.color),
        borderWidth: 1,
        barThickness: 40,
        borderRadius: 4,
      }
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(246, 255, 248, 0.1)', // mint with opacity - updated
        },
        ticks: {
          color: '#F6FFF8', // mint - updated
          font: {
            size: 12,
          },
          callback: function(value: any) {
            return `${value}%`;
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#F6FFF8', // mint - updated
          font: {
            size: 14,
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
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
            const strategy = strategies[context.dataIndex];
            const labels = [
              `Monthly Return: ${context.raw}%`,
              `Projected Profit: $${strategy.projectedProfit.toLocaleString()}`
            ];
            
            // Add pair contributions if available
            if (strategy.pairs && strategy.pairs.length > 0) {
              labels.push('');
              labels.push('Pair Contributions:');
              strategy.pairs.forEach(pair => {
                labels.push(`  ${pair.name}: ${pair.contribution.toFixed(2)}%`);
              });
            }
            
            return labels;
          },
        },
      },
    },
  };

  return (
    <div className="w-full h-full min-h-[400px]">
      <Bar data={data} options={options} height={400} />
    </div>
  );
} 