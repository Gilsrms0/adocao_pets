import React from 'react';
import { FaUserCircle, FaSignOutAlt } from 'react-icons/fa';

const Header = ({ onNavigate, user, onLogout }) => {
  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: '#f0f0f0' }}>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <button onClick={() => onNavigate('home')}>Início</button>
        <button onClick={() => onNavigate('pets')}>Pets para Adoção</button>
        <button onClick={() => onNavigate('adotantes')}>Adotantes</button>
      </div>
      <div>
        {user ? (
          <>
            <span style={{ marginRight: '1rem' }}>Olá, {user.name}</span>
            <button onClick={onLogout}>
              <FaSignOutAlt /> Sair
            </button>
          </>
        ) : (
          <>
            <button onClick={() => onNavigate('login')}>
              <FaUserCircle /> Login
            </button>
            <button onClick={() => onNavigate('register')} style={{ marginLeft: '1rem' }}>
              Cadastrar
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;