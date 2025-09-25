import React from 'react';

const HomePage = () => {
  return (
    <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ fontSize: '3rem', color: '#1f2937' }}>Bem-vindo ao Sistema de Adoção de Pets</h1>
      <p style={{ fontSize: '1.25rem', color: '#4b5563', marginTop: '1rem' }}>
        Encontre o seu novo amigo peludo ou ajude a encontrar um lar para um pet necessitado.
      </p>
      <div style={{ marginTop: '3rem' }}>
        <h2 style={{ fontSize: '2rem', color: '#1f2937' }}>Nossa Missão</h2>
        <p style={{ marginTop: '1rem', color: '#4b5563' }}>
          Conectar animais que precisam de um lar com pessoas dispostas a dar amor e carinho.
          Seja um adotante responsável e mude a vida de um pet para sempre!
        </p>
      </div>
    </div>
  );
};

export default HomePage;