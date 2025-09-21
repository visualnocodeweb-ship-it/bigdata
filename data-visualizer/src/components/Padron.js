import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { Table, Pagination, Form, Container, Row, Col } from 'react-bootstrap';
import './Padron.css';

function Padron() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(25);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    Papa.parse('/lagos_del_sur.csv', {
      download: true,
      header: true,
      complete: (results) => {
        setData(results.data);
        setLoading(false);
      },
    });
  }, []);

  const filteredData = data.filter((row) =>
    Object.values(row).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredData.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Container fluid>
      <h1 className="my-4">Visualizador de Datos Electorales - Lagos del Sur</h1>
      <Row className="mb-3">
        <Col>
          <Form.Control
            type="text"
            placeholder="Buscar..."
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </Col>
      </Row>
      <Table striped bordered hover responsive size="sm" className="compact-table">
        <thead>
          <tr>
            {data.length > 0 && Object.keys(data[0]).map((key) => <th key={key}>{key}</th>)}
          </tr>
        </thead>
        <tbody>
          {currentItems.map((row, index) => (
            <tr key={index}>
              {Object.values(row).map((value, i) => (
                <td key={i}>{value}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
      <Pagination>
        {pageNumbers.slice(Math.max(0, currentPage - 5), Math.min(pageNumbers.length, currentPage + 4)).map((number) => (
          <Pagination.Item key={number} active={number === currentPage} onClick={() => paginate(number)}>
            {number}
          </Pagination.Item>
        ))}
      </Pagination>
    </Container>
  );
}

export default Padron;
