import React, { useState, useEffect } from 'react';
// import axios from 'axios'; <-- REMOVIDO
import api from '../utils/api'; // <-- USANDO API CENTRALIZADA

const AdminPetList = ({ onEditClick }) => { // <-- REMOVIDO 'token' das props
  const [pets, setPets] = useState([]);
  const [message, setMessage] = useState('');

  const fetchPets = async () => {
    try {
      // Token é enviado automaticamente. Rota protegida (Admin)
      const response = await api.get('/pets/admin');
      setPets(response.data);
    } catch (error) {
      console.error("Erro ao buscar pets:", error.response?.data?.error || error.message);
      setMessage("Erro ao buscar pets para o painel de administração. Você tem permissão de Admin?");
    }
  };

  useEffect(() => {
    fetchPets();
  }, []); // <-- REMOVIDO [token]

  const handleDelete = async (petId) => {
    try {
      if (!window.confirm("Confirma a exclusão do pet?")) return;
      // Token é injetado automaticamente
      await api.delete(`/pets/${petId}`);
      fetchPets();
    } catch (error) {
      console.error("Erro ao deletar pet:", error);
      setMessage("Erro ao deletar pet. Verifique suas permissões.");
    }
  };

  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#f8f8f8', 
      borderRadius: '8px', 
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
    }}>
      {message && <p style={{ color: 'red', textAlign: 'center' }}>{message}</p>}
      {pets.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#666' }}>Nenhum pet encontrado.</p>
      ) : (
        <ul style={{ 
          listStyleType: 'none', 
          padding: 0 
        }}>
          {pets.map((pet) => (
            <li key={pet.id} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '15px',
              borderBottom: '1px solid #ddd',
              backgroundColor: 'white',
              marginBottom: '10px'
            }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.2em' }}>{pet.name}</h3>
                <p style={{ margin: '5px 0 0', color: '#555' }}>Espécie: {pet.species}</p>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => onEditClick(pet)} style={{ 
                  padding: '8px 12px', 
                  border: 'none', 
                  borderRadius: '5px', 
                  cursor: 'pointer', 
                  backgroundColor: '#3498db', 
                  color: 'white' 
                }}>Editar</button>
                <button onClick={() => handleDelete(pet.id)} style={{
                  padding: '8px 12px', 
                  border: 'none', 
                  borderRadius: '5px', 
                  cursor: 'pointer', 
                  backgroundColor: '#e74c3c', 
                  color: 'white' 
                }}>Excluir</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminPetList;