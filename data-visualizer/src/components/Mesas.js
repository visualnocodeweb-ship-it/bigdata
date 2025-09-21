import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { Table, Form, Container, Row, Col, Accordion } from 'react-bootstrap';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import './Padron.css'; // Re-using the same CSS for the table

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

function Mesas() {
  const [data, setData] = useState([]);
  const [groupedData, setGroupedData] = useState({});
  const [localidades, setLocalidades] = useState([]);
  const [selectedLocalidad, setSelectedLocalidad] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Papa.parse('/lagos_del_sur.csv', {
      download: true,
      header: true,
      complete: (results) => {
        const parsedData = results.data.filter(row => row.TX_LOCALIDAD && row.NU_MESA);
        setData(parsedData);

        const grouped = {};
        parsedData.forEach(row => {
          const localidad = row.TX_LOCALIDAD;
          const mesa = row.NU_MESA;

          if (!grouped[localidad]) {
            grouped[localidad] = {};
          }
          if (!grouped[localidad][mesa]) {
            grouped[localidad][mesa] = { voters: [], count: 0 };
          }
          grouped[localidad][mesa].voters.push(row);
          grouped[localidad][mesa].count++;
        });
        setGroupedData(grouped);

        const uniqueLocalidades = Object.keys(grouped).sort();
        setLocalidades(uniqueLocalidades);
        setLoading(false);
      },
    });
  }, []);

  const handleLocalidadChange = (e) => {
    setSelectedLocalidad(e.target.value);
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  const currentLocalidadMesas = selectedLocalidad ? groupedData[selectedLocalidad] : {};
  const mesaKeys = Object.keys(currentLocalidadMesas).sort((a, b) => parseInt(a) - parseInt(b));

  return (
    <Container fluid>
      <h1 className="my-4">Mesas por Localidad</h1>
      <Row className="mb-3 justify-content-center">
        <Col md={6}>
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

      {selectedLocalidad && (
        <Row className="justify-content-center mt-4">
          <Col md={10}>
            <h2>Localidad: {selectedLocalidad}</h2>
            <p>Total de Mesas: {mesaKeys.length}</p>

            <Accordion alwaysOpen>
              {mesaKeys.map((mesaKey, index) => {
                const mesaData = currentLocalidadMesas[mesaKey];
                const voterColumns = mesaData.voters.length > 0 ? Object.keys(mesaData.voters[0]) : [];

                // Process data for Gender Chart
                const genderCounts = { M: 0, F: 0, Other: 0 };
                mesaData.voters.forEach(voter => {
                  if (voter.TX_GENERO === 'M') genderCounts.M++;
                  else if (voter.TX_GENERO === 'F') genderCounts.F++;
                  else genderCounts.Other++;
                });

                const pieChartData = {
                  labels: ['Masculino', 'Femenino', 'Otros'],
                  datasets: [
                    {
                      data: [genderCounts.M, genderCounts.F, genderCounts.Other],
                      backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56'],
                      hoverBackgroundColor: ['#36A2EB', '#FF6384', '#FFCE56'],
                    },
                  ],
                };

                // Process data for Age Chart
                const currentYear = new Date().getFullYear();
                const ageRanges = { '18-25': 0, '26-35': 0, '36-45': 0, '46-55': 0, '56+': 0 };

                mesaData.voters.forEach(voter => {
                  const birthYear = parseInt(voter.TX_CLASE);
                  if (!isNaN(birthYear)) {
                    const age = currentYear - birthYear;
                    if (age >= 18 && age <= 25) ageRanges['18-25']++;
                    else if (age >= 26 && age <= 35) ageRanges['26-35']++;
                    else if (age >= 36 && age <= 45) ageRanges['36-45']++;
                    else if (age >= 46 && age <= 55) ageRanges['46-55']++;
                    else if (age >= 56) ageRanges['56+']++;
                  }
                });

                const barChartData = {
                  labels: Object.keys(ageRanges),
                  datasets: [
                    {
                      label: 'Votantes por Edad',
                      data: Object.values(ageRanges),
                      backgroundColor: 'rgba(75, 192, 192, 0.6)',
                      borderColor: 'rgba(75, 192, 192, 1)',
                      borderWidth: 1,
                    },
                  ],
                };

                return (
                  <Accordion.Item eventKey={index.toString()} key={mesaKey}>
                    <Accordion.Header>Mesa N°: {mesaKey} - Votantes: {mesaData.count}</Accordion.Header>
                    <Accordion.Body>
                      <h3>Detalle de Votantes en Mesa N° {mesaKey}</h3>
                      <Row>
                        <Col md={6}>
                          <h4>Distribución por Género</h4>
                          <div key={`pie-${mesaKey}-${selectedLocalidad}`} style={{ width: '100%', height: '300px' }}>
                            {console.log('pieChartData:', pieChartData)}
                            {pieChartData.datasets[0].data.length > 0 && <Pie data={pieChartData} options={{}} />}
                          </div>
                        </Col>
                        <Col md={6}>
                          <h4>Distribución por Edad</h4>
                          <div key={`bar-${mesaKey}-${selectedLocalidad}`} style={{ width: '100%', height: '300px' }}>
                            {console.log('barChartData:', barChartData)}
                            {barChartData.datasets[0].data.length > 0 && <Bar data={barChartData} options={{}} />}
                          </div>
                        </Col>
                      </Row>
                      <Table striped bordered hover responsive size="sm" className="compact-table mt-3">
                        <thead>
                          <tr>
                            {voterColumns.map(col => <th key={col}>{col}</th>)}
                          </tr>
                        </thead>
                        <tbody>
                          {mesaData.voters.map((voter, voterIndex) => (
                            <tr key={voterIndex}>
                              {voterColumns.map((col, colIndex) => (
                                <td key={colIndex}>{voter[col]}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </Accordion.Body>
                  </Accordion.Item>
                );
              })}
            </Accordion>
          </Col>
        </Row>
      )}
    </Container>
  );
}

export default Mesas;
