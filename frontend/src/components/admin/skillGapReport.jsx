import React, { useState, useEffect } from 'react';
import apiClient from '../../api/apiClient';
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const SkillGapReport = () => {
  const [reportData, setReportData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await apiClient.get('/reports/skill-gap');
        
        const labels = response.data.map(item => item.skill_name);
        const data = response.data.map(item => item.average_score);
        
        setReportData({
          labels,
          datasets: [
            {
              label: 'Average Score (%)',
              data,
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
          ],
        });

      } catch (err) {
        setError('Failed to fetch skill gap report.');
        console.error(err);
      }
    };
    fetchReport();
  }, []);

  if (error) return <p className="error-message">{error}</p>;
  if (!reportData) return <p>Loading report...</p>;

  return (
    <div>
      <h3>Skill Gap Analysis (Lowest scores indicate largest gaps)</h3>
      <Bar 
        data={reportData} 
        options={{ 
            indexAxis: 'y', // Makes it a horizontal bar chart for better readability
            responsive: true,
            plugins: {
                legend: { position: 'top' },
                title: { display: true, text: 'Average Score by Skill' }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }} 
    />
    </div>
  );
};

export default SkillGapReport;