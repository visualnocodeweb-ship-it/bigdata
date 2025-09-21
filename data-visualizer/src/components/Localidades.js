import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { Table, Form, Container, Row, Col } from 'react-bootstrap';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title as ChartTitle } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import './Padron.css'; // Re-using the same CSS for the table

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, ChartTitle);

function Localidades() {
  const [data, setData] = useState([]);
  const [localidades, setLocalidades] = useState([]);
  const [selectedLocalidad, setSelectedLocalidad] = useState('');
  const [loading, setLoading] = useState(true);
  const [localityStats, setLocalityStats] = useState({});

  useEffect(() => {
    Papa.parse('/lagos_del_sur.csv', {
      download: true,
      header: true,
      complete: (results) => {
        const parsedData = results.data;
        setData(parsedData);

        const uniqueLocalidades = new Set();
        const stats = {};

        parsedData.forEach(row => {
          const localidad = row.TX_LOCALIDAD;
          if (localidad) {
            uniqueLocalidades.add(localidad);

            if (!stats[localidad]) {
              stats[localidad] = {
                totalVoters: 0,
                uniqueMesas: new Set(),
                genderCounts: { M: 0, F: 0, X: 0 },
                ageRanges: { '18-25': 0, '26-35': 0, '36-45': 0, '46-55': 0, '56-65': 0, '66+': 0 },
              };
            }

            stats[localidad].totalVoters++;
            if (row.NU_MESA) stats[localidad].uniqueMesas.add(row.NU_MESA);

            if (row.TX_GENERO === 'M') stats[localidad].genderCounts.M++;
            else if (row.TX_GENERO === 'F') stats[localidad].genderCounts.F++;
            else stats[localidad].genderCounts.X++;

            const birthYear = parseInt(row.TX_CLASE, 10);
            if (!isNaN(birthYear)) {
              const currentYear = new Date().getFullYear();
              const age = currentYear - birthYear;

              if (age >= 18 && age <= 25) stats[localidad].ageRanges['18-25']++;
              else if (age >= 26 && age <= 35) stats[localidad].ageRanges['26-35']++;
              else if (age >= 36 && age <= 45) stats[localidad].ageRanges['36-45']++;
              else if (age >= 46 && age <= 55) stats[localidad].ageRanges['46-55']++;
              else if (age >= 56 && age <= 65) stats[localidad].ageRanges['56-65']++;
              else if (age >= 66) stats[localidad].ageRanges['66+']++;
            }
          }
        });

        // Convert Sets to size and prepare chart data
        Object.keys(stats).forEach(loc => {
          stats[loc].totalMesas = stats[loc].uniqueMesas.size;
          delete stats[loc].uniqueMesas; // No longer needed

          // Prepare chart data
          stats[loc].genderChartData = {
            labels: ['Masculino', 'Femenino', 'Otros'],
            datasets: [
              {
                data: [stats[loc].genderCounts.M, stats[loc].genderCounts.F, stats[loc].genderCounts.X],
                backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56'],
                hoverOffset: 4,
              },
            ],
          };

          stats[loc].ageChartData = {
            labels: Object.keys(stats[loc].ageRanges),
            datasets: [
              {
                label: 'Votantes por Edad',
                data: Object.values(stats[loc].ageRanges),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
              },
            ],
          };
        });

        setLocalityStats(stats);
        setLocalidades(Array.from(uniqueLocalidades).sort());
        setLoading(false);
      },
    });
  }, []);

  const handleLocalidadChange = (e) => {
    setSelectedLocalidad(e.target.value);
  };

  const filteredData = data.filter(
    (row) => row.TX_LOCALIDAD === selectedLocalidad
  );

  const currentStats = localityStats[selectedLocalidad];

  if (loading) {
    return <div>Cargando datos de localidades...</div>;
  }

  return (
    <Container fluid>
      <h1 className="my-4">Datos por Localidad</h1>
      <Row className="mb-3">
        <Col>
          <Form.Select onChange={handleLocalidadChange} value={selectedLocalidad}>
            <option value="">Seleccione una localidad</option>
            {localidades.map((localidad) => (
              <option key={localidad} value={localidad}>
                {localidad}
              </option>
            ))}
          </Form.Select>
        </Col>
      </Row>
      {selectedLocalidad && currentStats && (
        <>
          <Row className="my-4">
            <Col md={6}>
              <h4>Resumen de {selectedLocalidad}</h4>
              <p>Total de Votantes: <strong>{currentStats.totalVoters}</strong></p>
              <p>Total de Mesas: <strong>{currentStats.totalMesas}</strong></p>
            </Col>
            <Col md={6}>
              <h4>Distribución por Género</h4>
              <div style={{ maxWidth: '400px', margin: 'auto' }}>
                <Pie data={currentStats.genderChartData} options={{ plugins: { title: { display: true, text: 'Género' } } }} />
              </div>
            </Col>
          </Row>
          <Row className="my-4">
            <Col>
              <h4>Distribución por Edad</h4>
              <div style={{ maxWidth: '600px', margin: 'auto' }}>
                <Bar data={currentStats.ageChartData} options={{ plugins: { title: { display: true, text: 'Edad' } } }} />
              </div>
            </Col>
          </Row>
          <h3 className="mt-5">Detalle de Votantes</h3>
          <Table striped bordered hover responsive size="sm" className="compact-table">
            <thead>
              <tr>
                {data.length > 0 && Object.keys(data[0]).map((key) => <th key={key}>{key}</th>)}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row, index) => (
                <tr key={index}>
                  {Object.values(row).map((value, i) => (
                    <td key={i}>{value}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
    </Container>
  );
}

export default Localidades;