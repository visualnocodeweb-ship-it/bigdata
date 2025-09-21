import React, { useEffect, useState, useRef } from 'react';
import Papa from 'papaparse';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const MapaVotantes = () => {
  const mapRef = useRef(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fix for default icon issue with webpack
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-black.png',
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-black.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });

    Papa.parse('/lagos_del_sur.csv', {
      download: true,
      header: true,
      complete: (results) => {
        const parsedData = results.data;
        const voterCounts = parsedData.reduce((acc, row) => {
          const lat = parseFloat(row.LATITUD);
          const lng = parseFloat(row.LONGITUD);

          if (!isNaN(lat) && !isNaN(lng)) {
            const key = `${lat},${lng}`;
            if (!acc[key]) {
              acc[key] = { lat, lng, count: 0, mesas: new Set(), establecimiento: new Set() };
            }
            acc[key].count++;
            if (row.NU_MESA) acc[key].mesas.add(row.NU_MESA);
            if (row.ESTABLECIMIENTO) acc[key].establecimiento.add(row.ESTABLECIMIENTO);
          }
          return acc;
        }, {});

        setData(Object.values(voterCounts).map(point => ({
          ...point,
          mesas: Array.from(point.mesas).sort(),
          establecimiento: Array.from(point.establecimiento).sort()
        })));
        setLoading(false);
      },
    });
  }, []);

  useEffect(() => {
    if (!loading && data.length > 0) {
      if (mapRef.current) {
        mapRef.current.remove(); // Remove existing map instance if any
      }

      const map = L.map('map-container').setView([-40.16, -71.35], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      data.forEach(point => {
        const schoolName = point.establecimiento.length > 0 ? point.establecimiento[0] : 'Desconocido';
        const encodedSchoolName = encodeURIComponent(schoolName);

        const popupContent = `
          <b>Escuela: ${schoolName}</b><br/>
          <b>Votantes: ${point.count}</b><br/>
          <b>Mesas:</b> ${point.mesas.join(', ')}<br/>
          <a href="/sm-andes?school=${encodedSchoolName}">Ver detalles de la escuela</a>
        `;

        L.marker([point.lat, point.lng])
          .addTo(map)
          .bindPopup(popupContent);
      });

      mapRef.current = map;
    }
  }, [loading, data]);

  if (loading) {
    return <div>Cargando mapa...</div>;
  }

  return (
    <div id="map-container" style={{ height: '800px', width: '100%' }}></div>
  );
};

export default MapaVotantes;