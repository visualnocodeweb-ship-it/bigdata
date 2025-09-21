import React from 'react';
import { Nav, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { List, Table, Building, PinMap, Map, BarChart } from 'react-bootstrap-icons';

const Sidebar = () => {
  return (
    <div className="d-none d-lg-block bg-light vh-100 p-3" style={{width: '250px', position: 'fixed'}}>
      <h4>Menu</h4>
      <Nav className="flex-column">
        <Nav.Item>
          <strong className="ms-2">Lagos del Sur</strong>
        </Nav.Item>
        <Nav.Link as={Link} to="/padron" className="ms-3">
          <Table className="me-2" /> Padron 2025
        </Nav.Link>
        <Nav.Link as={Link} to="/localidades" className="ms-3">
          <Building className="me-2" /> Localidades
        </Nav.Link>
        <Nav.Link as={Link} to="/mesas" className="ms-3">
          <Table className="me-2" /> Mesas
        </Nav.Link>
        <Nav.Link as={Link} to="/sm-andes" className="ms-3">
          <PinMap className="me-2" /> S.M de los Andes
        </Nav.Link>
        <Nav.Link as={Link} to="/mapa-votantes" className="ms-3">
          <Map className="me-2" /> Mapa de Votantes
        </Nav.Link>

        <Nav.Item>
          <strong className="ms-2">Antecedentes Resultados 2023 S.M de los Andes</strong>
        </Nav.Item>
        <Nav.Link as={Link} to="/resultados-intendente" className="ms-3">
          <BarChart className="me-2" /> Resultados elecciones intendente
        </Nav.Link>
        <Nav.Link as={Link} to="/resultados-presidente" className="ms-3">
          <BarChart className="me-2" /> Resultados elecciones presidente
        </Nav.Link>

        <hr className="my-3" />

        <Nav.Item className="d-flex align-items-center">
          <img src="/OIP.webp" alt="AI Icon" style={{ width: '24px', height: '24px', marginRight: '8px' }} />
          <strong className="ms-2">Simulacion Datos 2025 Agente IA (Proximamente)</strong>
        </Nav.Item>
      </Nav>
    </div>
  );
};

export default Sidebar;