import React, { useEffect, useState } from 'react';
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
import { HistoricalData } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { formatChartDate, formatCurrency } from '../../utils/formatters';
import { useTranslation } from 'react-i18next';

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

interface PriceChartProps {
  historicalData: HistoricalData[];
  timeframe: number;
}

const PriceChart: React.FC<PriceChartProps> = ({ historicalData, timeframe }) => {
  const { theme } = useTheme();
  const { i18n } = useTranslation();
  const [chartData, setChartData] = useState({
    labels: [] as string[],
    datasets: [
      {
        label: 'Bitcoin Price',
        data: [] as number[],
        borderColor: '#0ea5e9',
        backgroundColor: 'rgba(14, 165, 233, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        borderWidth: 2,
        pointHoverRadius: 5,
      },
    ],
  });

  useEffect(() => {
    if (historicalData.length === 0) return;

    const labels = historicalData.map((data) => 
      formatChartDate(data.timestamp, timeframe, i18n.language)
    );

    const prices = historicalData.map((data) => data.price);

    setChartData({
      labels,
      datasets: [
        {
          ...chartData.datasets[0],
          data: prices,
          borderColor: theme === 'dark' ? '#38bdf8' : '#0ea5e9',
          backgroundColor: theme === 'dark' 
            ? 'rgba(56, 189, 248, 0.1)' 
            : 'rgba(14, 165, 233, 0.1)',
        },
      ],
    });
  }, [historicalData, timeframe, theme, i18n.language]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: theme === 'dark' ? '#262626' : 'rgba(255, 255, 255, 0.9)',
        titleColor: theme === 'dark' ? '#e5e5e5' : '#262626',
        bodyColor: theme === 'dark' ? '#e5e5e5' : '#262626',
        borderColor: theme === 'dark' ? '#525252' : '#e5e5e5',
        borderWidth: 1,
        padding: 12,
        titleFont: {
          size: 14,
          weight: 'bold',
        },
        bodyFont: {
          size: 14,
        },
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += formatCurrency(context.parsed.y);
            }
            return label;
          }
        }
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          maxRotation: 0,
          color: theme === 'dark' ? '#a3a3a3' : '#737373',
          font: {
            size: 10,
          },
          maxTicksLimit: 8,
        },
      },
      y: {
        position: 'right' as const,
        grid: {
          color: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          color: theme === 'dark' ? '#a3a3a3' : '#737373',
          callback: function(value: any) {
            return formatCurrency(value, true);
          },
        },
      },
    },
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    elements: {
      point: {
        radius: 0,
      },
    },
  };

  return (
    <div className="h-80">
      {historicalData.length > 0 ? (
        <Line data={chartData} options={options} />
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-neutral-500 dark:text-neutral-400">
            Loading chart data...
          </p>
        </div>
      )}
    </div>
  );
};