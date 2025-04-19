import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function ScoreChart({ results }) {
  const subjects = Object.keys(results);
  const midpoints = subjects.map(subject => results[subject].midpoint);
  
  const chartData = {
    labels: subjects,
    datasets: [
      {
        label: 'Percentile (Midpoint)',
        data: midpoints,
        backgroundColor: [
          'rgba(54, 162, 235, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(255, 99, 132, 0.7)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'FRM Exam Results by Subject',
      },
    },
    scales: {
      y: {
        min: 0,
        max: 100,
        title: {
          display: true,
          text: 'Percentile'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Subject'
        }
      }
    }
  };

  return (
    <div className="w-full p-4 bg-white rounded-lg shadow">
      <Bar data={chartData} options={options} />
    </div>
  );
}
