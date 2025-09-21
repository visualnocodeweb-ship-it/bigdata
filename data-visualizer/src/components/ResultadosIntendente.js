import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Container } from 'react-bootstrap';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ResultadosIntendente = () => {
  const data = {
    labels: ['Saloniti', 'Monín Aquín', 'Martín Rodríguez'],
    datasets: [
      {
        label: 'Cantidad de Votos',
        data: [6119, 5417, 3966],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
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
        text: 'Resultados Elecciones Intendente',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <Container>
      <h1 className="my-4">Resultados Elecciones Intendente 2023</h1>
      <div style={{ maxWidth: '800px', margin: 'auto' }}>
        <Bar data={data} options={options} />
      </div>
    </Container>
  );
};

export default ResultadosIntendente;