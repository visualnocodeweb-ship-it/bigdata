import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Container } from 'react-bootstrap';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ResultadosPresidente = () => {
  const balotajeData = {
    labels: ['Milei', 'Massa'],
    datasets: [
      {
        label: 'Cantidad de Votos (Balotaje)',
        data: [15171, 7912],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const primeraRondaData = {
    labels: ['Milei', 'Bullrich', 'Massa', 'Schiaretti', 'Bregman'],
    datasets: [
      {
        label: 'Cantidad de Votos (Primera Ronda)',
        data: [8185, 6674, 6080, 1484, 1245],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
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
        text: 'Resultados Elecciones Presidente 2023',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const primeraRondaOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Resultados Primera Ronda 2023 - Lácar',
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
      <h1 className="my-4">Resultados Elecciones Presidente 2023</h1>
      <div style={{ maxWidth: '800px', margin: 'auto' }}>
        <h3>Balotaje</h3>
        <Bar data={balotajeData} options={options} />
      </div>

      <div style={{ maxWidth: '800px', margin: 'auto', marginTop: '50px' }}>
        <h3>Primera Ronda</h3>
        <Bar data={primeraRondaData} options={primeraRondaOptions} />
      </div>
    </Container>
  );
};

export default ResultadosPresidente;