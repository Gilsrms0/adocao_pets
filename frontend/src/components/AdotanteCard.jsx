import React from 'react';
import styles from './AdotanteCard.module.css';

const AdotanteCard = ({ adotante }) => {
  return (
    <div className={styles.card}>
      <img
        src={adotante.imageUrl || 'https://via.placeholder.com/400'}
        alt={`Foto de ${adotante.name}`}
        className={styles.image}
      />
      <div className={styles.content}>
        <h3 className={styles.title}>{adotante.name}</h3>
        <p className={styles.info}>Email: {adotante.email}</p>
        <p className={styles.info}>Telefone: {adotante.phone || 'N/A'}</p>
      </div>
    </div>
  );
};

export default AdotanteCard;