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

const RadarChart = ({ userStat }) => {
  if (!userStat) {
    return null;
  }

  const data = {
    labels: [
      userStat.skillOne,
      userStat.skillTwo,
      userStat.skillThree,
      userStat.skillFour,
      userStat.skillFive
    ],
    datasets: [
      {
        label: 'Your Scores',
        data: [
          userStat.skillOneValue,
          userStat.skillTwoValue,
          userStat.skillThreeValue,
          userStat.skillFourValue,
          userStat.skillFiveValue
        ],
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: false, // Hide the legend
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        beginAtZero: true,
      },
    },
  };
  
  return (
    <div className="radar-chart" style={{ margin: '0 auto' }}>
      <Radar data={data} options={options} />
    </div>
  );
};

export default RadarChart;
