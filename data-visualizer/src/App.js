import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Padron from './components/Padron';
import Localidades from './components/Localidades';
import Mesas from './components/Mesas';
import SMAndes from './components/SMAndes';
import MapaVotantes from './components/MapaVotantes';
import ResultadosIntendente from './components/ResultadosIntendente';
import ResultadosPresidente from './components/ResultadosPresidente';
import Home from './components/Home';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <Router basename="/">
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/padron" element={<Padron />} />
            <Route path="/localidades" element={<Localidades />} />
            <Route path="/mesas" element={<Mesas />} />
            <Route path="/sm-andes" element={<SMAndes />} />
            <Route path="/mapa-votantes" element={<MapaVotantes />} />
            <Route path="/resultados-intendente" element={<ResultadosIntendente />} />
            <Route path="/resultados-presidente" element={<ResultadosPresidente />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;