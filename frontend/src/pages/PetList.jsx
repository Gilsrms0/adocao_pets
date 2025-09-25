import React, { useState, useEffect } from 'react';
import PetCard from '../components/PetCard.jsx';
import styles from './PetList.module.css';
import api from '../utils/api'; // <-- USANDO API CENTRALIZADA

const PetList = () => {
  const [pets, setPets] = useState([]);
  const [filteredPets, setFilteredPets] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchPets = async () => {
      try {
        // Rota pública
        const response = await api.get('/pets');
        setPets(response.data);
      } catch (error) {
        console.error("Erro ao buscar pets:", error);
      }
    };
    fetchPets();
  }, []);

  useEffect(() => {
    if (filter === 'all') {
      setFilteredPets(pets);
    } else if (filter === 'filhote') {
      const today = new Date();
      const oneYearAgo = new Date(today.setFullYear(today.getFullYear() - 1));
      setFilteredPets(pets.filter(pet => new Date(pet.birthDate) > oneYearAgo));
    } else {
      setFilteredPets(pets.filter(pet => pet.species.toLowerCase() === filter));
    }
  }, [filter, pets]);

  const filterOptions = ['all', 'cão', 'gato', 'filhote', 'outros'];

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Adote um amigo peludo!</h1>
      <div className={styles['filter-buttons']}>
        {filterOptions.map(option => (
          <button
            key={option}
            onClick={() => setFilter(option)}
            className={`${styles['filter-button']} ${filter === option ? styles.active : styles.inactive}`}
          >
            {option === 'all' ? 'Todos' : option.charAt(0).toUpperCase() + option.slice(1)}
          </button>
        ))}
      </div>
      <div className={styles['card-grid']}>
        {filteredPets.length > 0 ? (
          filteredPets.map(pet => (
            <PetCard key={pet.id} pet={pet} />
          ))
        ) : (
          <p className={styles['no-pets-message']}>Nenhum pet encontrado.</p>
        )}
      </div>
    </div>
  );
};

export default PetList;