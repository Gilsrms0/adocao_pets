import React from 'react';
import styles from './PetCard.module.css';

const PetCard = ({ pet }) => {
  return (
    <div className={styles.card}>
      <img
        src={pet.imageUrl || 'https://via.placeholder.com/400'}
        alt={`Foto de ${pet.name}`}
        className={styles.image}
      />
      <div className={styles.content}>
        <h3 className={styles.title}>{pet.name}</h3>
        <p className={styles.species}>{pet.species}</p>
        <p className={styles.description}>
          {pet.description.substring(0, 100)}...
        </p>
        <div className={styles.status}>
          <span className={styles['status-badge']}>
            {pet.status === 'disponivel' ? 'Disponível' : 'Adotado'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PetCard;