import React from 'react';
import { Container } from 'react-bootstrap';

const Home = () => {
  const BigDataImage = process.env.PUBLIC_URL + '/Big-data.jpg';

  return (
    <Container className="text-center mt-5">
      <h1 style={{ color: '#00BFA5' }}>Bienvenido a Big Data NQN</h1>
      <p>Selecciona una opción del menú lateral para comenzar.</p>
      <img 
        src={BigDataImage} 
        alt="Big Data Background" 
        style={{
          opacity: 0.5,
          display: 'block',
          margin: '20px auto',
          maxWidth: '100%', /* Ensure image fits within container */
          height: 'auto'
        }}
      />
    </Container>
  );
};

export default Home;