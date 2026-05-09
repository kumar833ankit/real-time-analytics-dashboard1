import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useLivePrice } from '../hooks/useLivePrice';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface CryptoChartProps {
  assetId: string;
}

export const CryptoChart: React.FC<CryptoChartProps> = ({ assetId }) => {
  const livePrice = useLivePrice(assetId);
  const [dataPoints, setDataPoints] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);

  useEffect(() => {
    if (livePrice <= 0) return;

    setDataPoints(prev => [...prev.slice(-29), livePrice]);
    
    setLabels(prev => {
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      return [...prev.slice(-29), now];
    });
  }, [livePrice]);

  const chartData = {
    labels: labels.length ? labels : Array(15).fill(''),
    datasets: [{
      label: `${assetId.toUpperCase()} Price`,
      data: dataPoints.length ? dataPoints : Array(15).fill(livePrice || 0),
      borderColor: '#22d3ee',
      backgroundColor: 'rgba(34, 211, 238, 0.1)',
      tension: 0.4,
      borderWidth: 3,
      pointRadius: 0,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 300 },
    plugins: { legend: { display: false } },
    scales: {
      y: { 
        grid: { color: '#334155' }, 
        ticks: { color: '#94a3b8' } 
      },
      x: { 
        grid: { color: '#334155' }, 
        ticks: { color: '#94a3b8', maxTicksLimit: 8 } 
      },
    },
  };

  return <Line data={chartData} options={options} />;
};