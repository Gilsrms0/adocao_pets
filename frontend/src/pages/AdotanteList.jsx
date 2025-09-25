import React, { useState, useEffect } from 'react';
import AdotanteCard from '../components/AdotanteCard.jsx';
import styles from './AdotanteList.module.css';
import api from '../utils/api'; // <-- USANDO API CENTRALIZADA

const AdotanteList = () => {
  const [adotantes, setAdotantes] = useState([]);
  const [filteredAdotantes, setFilteredAdotantes] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchAdotantes = async () => {
      try {
        // Rota pública de adotantes (o token NÃO é enviado)
        // Se esta rota for protegida no seu backend, você precisará de uma rota /adotantes/public
        const response = await api.get('/adotantes'); 
        setAdotantes(response.data);
      } catch (error) {
        console.error("Erro ao buscar adotantes:", error);
      }
    };
    fetchAdotantes();
  }, []);

  useEffect(() => {
    if (filter === 'all') {
      setFilteredAdotantes(adotantes);
    } else {
      setFilteredAdotantes(
        adotantes.filter(adotante => adotante.name.toLowerCase().startsWith(filter))
      );
    }
  }, [filter, adotantes]);

  const alphabet = ['all', ...Array.from({ length: 26 }, (_, i) => String.fromCharCode(97 + i))];

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Conheça os Adotantes!</h1>
      <div className={styles['filter-buttons']}>
        {alphabet.map(letter => (
          <button
            key={letter}
            onClick={() => setFilter(letter)}
            className={`${styles['filter-button']} ${filter === letter ? styles.active : styles.inactive}`}
          >
            {letter.toUpperCase()}
          </button>
        ))}
      </div>
      <div className={styles['card-grid']}>
        {filteredAdotantes.length > 0 ? (
          filteredAdotantes.map(adotante => (
            <AdotanteCard key={adotante.id} adotante={adotante} />
          ))
        ) : (
          <p className={styles['no-adotantes-message']}>Nenhum adotante encontrado.</p>
        )}
      </div>
    </div>
  );
};

export default AdotanteList;