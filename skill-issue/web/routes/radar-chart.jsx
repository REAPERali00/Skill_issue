import React from 'react';
import { useFindMany, useUser } from '@gadgetinc/react';
import { api } from '../api';
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
 


export default function RadarChart() {
  const user = useUser();
  const [{ data: userStats, fetching, error }] = useFindMany(api.userStat, {
    filter: { user: { equals: user.id } }
  });

  if (fetching) {
    return <div>Loading skills data...</div>;
  }

  if (error) {
    return <div>Error loading skills: {error.message}</div>;
  }

  if (!userStats || userStats.length === 0) {
    return <div>No skills data found</div>;
  }

  const userStat = userStats[0];
  
  const chartData = {
    labels: [
      userStat.skillOne,
      userStat.skillTwo,
      userStat.skillThree,
      userStat.skillFour,
      userStat.skillFive
    ],
    datasets: [
      {
        label: 'Skill Levels',
        data: [
          userStat.skillOneValue,
          userStat.skillTwoValue,
          userStat.skillThreeValue,
          userStat.skillFourValue,
          userStat.skillFiveValue
        ],
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }
    ]
  };

  const options = {
    responsive: true,
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        min: 0
      },
    },
  };

  return (
    <div style={{ width: '500px', height: '500px', margin: '0 auto' }}>
      <h2>Your Skill Radar</h2>
      <Radar data={chartData} options={options} />
    </div>
  );
};
