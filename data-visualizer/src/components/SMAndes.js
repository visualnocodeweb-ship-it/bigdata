import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import { Table, Accordion } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useLocation } from 'react-router-dom';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SMAndes = () => {
  const [escuelas, setEscuelas] = useState({});
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const schoolName = queryParams.get('school');

    Papa.parse('/lagos_del_sur.csv', {
      download: true,
      header: true,
      complete: (results) => {
        const data = results.data;
        const filteredData = data.filter(row => {
          if (schoolName) {
            return row.ESTABLECIMIENTO === schoolName;
          } else {
            return row.TX_LOCALIDAD === 'SAN MARTIN DE LOS ANDES';
          }
        });

        const escuelasAgrupadas = filteredData.reduce((acc, row) => {
          const escuela = row.ESTABLECIMIENTO;
          const mesa = row.NU_MESA;

          if (!acc[escuela]) {
            acc[escuela] = { mesas: {}, ageGroups: {
              '18-25': 0,
              '26-35': 0,
              '36-45': 0,
              '46-55': 0,
              '56-65': 0,
              '66+': 0,
            }, totalVoters: 0 };
          }

          if (!acc[escuela].mesas[mesa]) {
            acc[escuela].mesas[mesa] = [];
          }

          acc[escuela].mesas[mesa].push({
            matricula: row.NU_MATRICULA,
            apellido: row.TX_APELLIDO,
            nombre: row.TX_NOMBRE,
            domicilio: row.TX_DOMICILIO,
          });

          acc[escuela].totalVoters++;

          const birthYear = parseInt(row.TX_CLASE, 10);
          if (!isNaN(birthYear)) {
            const currentYear = new Date().getFullYear();
            const age = currentYear - birthYear;

            if (age >= 18 && age <= 25) acc[escuela].ageGroups['18-25']++;
            else if (age >= 26 && age <= 35) acc[escuela].ageGroups['26-35']++;
            else if (age >= 36 && age <= 45) acc[escuela].ageGroups['36-45']++;
            else if (age >= 46 && age <= 55) acc[escuela].ageGroups['46-55']++;
            else if (age >= 56 && age <= 65) acc[escuela].ageGroups['56-65']++;
            else if (age >= 66) acc[escuela].ageGroups['66+']++;
          }

          return acc;
        }, {});

        Object.keys(escuelasAgrupadas).forEach(escuela => {
          escuelasAgrupadas[escuela].chartData = {
            labels: Object.keys(escuelasAgrupadas[escuela].ageGroups),
            datasets: [
              {
                label: 'Distribución de Edad',
                data: Object.values(escuelasAgrupadas[escuela].ageGroups),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
              },
            ],
          };
        });

        setEscuelas(escuelasAgrupadas);
      }
    });
  }, [location.search]);

  const queryParams = new URLSearchParams(location.search);
  const schoolName = queryParams.get('school');

  return (
    <div>
      <h2>{schoolName ? `Detalles de la escuela: ${schoolName}` : 'Escuelas en San Martín de los Andes'}</h2>
      <Accordion>
        {Object.keys(escuelas).map((escuela, index) => (
          <Accordion.Item eventKey={index.toString()} key={index}>
            <Accordion.Header>{escuela}</Accordion.Header>
            <Accordion.Body>
              {escuelas[escuela].chartData && (
                <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                  <Bar
                    data={escuelas[escuela].chartData}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          position: 'top',
                        },
                        title: {
                          display: true,
                          text: `Distribución de Edad en ${escuela}`,
                        },
                      },
                    }}
                  />
                  <p>Total de votantes en esta escuela: {escuelas[escuela].totalVoters}</p>
                </div>
              )}
              {escuelas[escuela].mesas && <Accordion>
                {Object.keys(escuelas[escuela].mesas).map((mesa, i) => (
                  <Accordion.Item eventKey={i.toString()} key={i}>
                    <Accordion.Header>Mesa N° {mesa} ({escuelas[escuela].mesas[mesa].length} votantes)</Accordion.Header>
                    <Accordion.Body>
                      <Table striped bordered hover responsive>
                        <thead>
                          <tr>
                            <th>Matrícula</th>
                            <th>Apellido</th>
                            <th>Nombre</th>
                            <th>Domicilio</th>
                          </tr>
                        </thead>
                        <tbody>
                          {escuelas[escuela].mesas[mesa].map((votante, j) => (
                            <tr key={j}>
                              <td>{votante.matricula}</td>
                              <td>{votante.apellido}</td>
                              <td>{votante.nombre}</td>
                              <td>{votante.domicilio}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </Accordion.Body>
                  </Accordion.Item>
                ))}
              </Accordion>}
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  );
};

export default SMAndes;