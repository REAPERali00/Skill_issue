// RadarChart.js
import React from 'react';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const RadarChart = () => {
  const data = {
    labels: ['Workout', 'Java', 'Singing', 'Python', 'Running'],
    datasets: [
      {
        label: 'Player A',
        data: [65, 59, 90, 81, 56],
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      r: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div style={{ width: '300px', height: '300px', margin: '0 auto' }}>
      <Radar data={data} options={options} />
    </div>
  );
};

export default RadarChart;
