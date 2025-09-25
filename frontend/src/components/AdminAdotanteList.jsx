import React, { useState, useEffect } from 'react';
// import axios from 'axios'; <-- REMOVIDO
import api from '../utils/api'; // <-- USANDO API CENTRALIZADA

const AdminAdotanteList = ({ onEditClick }) => { // <-- REMOVIDO 'token' das props
  const [adotantes, setAdotantes] = useState([]);
  const [message, setMessage] = useState('');

  const fetchAdotantes = async () => {
    try {
      // Token é enviado automaticamente via api.js. Rota protegida (Admin)
      const response = await api.get('/adotantes'); 
      setAdotantes(response.data);
    } catch (error) {
      console.error("Erro ao buscar adotantes:", error.response?.data?.error || error.message);
      setMessage("Erro: Você tem permissão de Admin e está logado?");
    }
  };

  useEffect(() => {
    fetchAdotantes();
  }, []); // <-- REMOVIDO [token] da dependência, pois a função não depende mais dele

  const handleDelete = async (adotanteId) => {
    try {
      if (!window.confirm("Confirma a exclusão do adotante?")) return;
      // Token é injetado automaticamente
      await api.delete(`/adotantes/${adotanteId}`);
      fetchAdotantes();
    } catch (error) {
      console.error("Erro ao deletar adotante:", error);
      setMessage("Erro ao deletar adotante. Verifique suas permissões.");
    }
  };

  return (
    <div className={styles.container}>
      {message && <p className={styles.message}>{message}</p>}
      {adotantes.length === 0 ? (
        <p>Nenhum adotante encontrado.</p>
      ) : (
        <ul className={styles.list}>
          {adotantes.map((adotante) => (
            <li key={adotante.id} className={styles.item}>
              <div>
                <h3>{adotante.name}</h3>
                <p>Email: {adotante.email}</p>
                <p>Endereço: {adotante.address || 'Não informado'}</p> {/* <-- MOSTRANDO ENDEREÇO */}
              </div>
              <div className={styles.actions}>
                <button onClick={() => onEditClick(adotante)} className={styles.editButton}>Editar</button>
                <button onClick={() => handleDelete(adotante.id)} className={styles.deleteButton}>Excluir</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminAdotanteList;