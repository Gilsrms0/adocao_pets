import React, { useState, useEffect } from 'react';
// import axios from 'axios'; <-- REMOVIDO
import api from '../utils/api'; // <-- USANDO API CENTRALIZADA

const PetForm = ({ petToEdit, onCancel }) => { // <-- REMOVIDO 'token' das props
  const [name, setName] = useState('');
  const [species, setSpecies] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('disponivel');
  const [imageFile, setImageFile] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (petToEdit) {
      setName(petToEdit.name);
      setSpecies(petToEdit.species);
      setBirthDate(petToEdit.birthDate.substring(0, 10));
      setDescription(petToEdit.description);
      setStatus(petToEdit.status);
    } else {
      setName('');
      setSpecies('');
      setBirthDate('');
      setDescription('');
      setStatus('disponivel');
    }
  }, [petToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    const formData = new FormData();
    formData.append('name', name);
    formData.append('species', species);
    formData.append('birthDate', birthDate);
    formData.append('description', description);
    formData.append('status', status);
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      if (petToEdit) {
        // Atualizar. Token injetado.
        await api.put(`/pets/${petToEdit.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setMessage('Pet atualizado com sucesso!');
        onCancel();
      } else {
        // Cadastrar. Token injetado.
        await api.post('/pets', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setMessage('Pet cadastrado com sucesso!');
        setName('');
        setSpecies('');
        setBirthDate('');
        setDescription('');
        setImageFile(null);
        document.getElementById('image-upload').value = '';
      }
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Erro ao salvar o pet. Verifique os dados.';
      setMessage(errorMsg);
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <input type="text" placeholder="Nome" value={name} onChange={(e) => setName(e.target.value)} required style={{ padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.25rem' }} />
      <input type="text" placeholder="Espécie" value={species} onChange={(e) => setSpecies(e.target.value)} required style={{ padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.25rem' }} />
      <label>Data de Nascimento:</label>
      <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} required style={{ padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.25rem' }} />
      <textarea placeholder="Descrição" value={description} onChange={(e) => setDescription(e.target.value)} required style={{ padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.25rem' }} />
      <label>Status:</label>
      <select value={status} onChange={(e) => setStatus(e.target.value)} style={{ padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.25rem' }}>
        <option value="disponivel">Disponível</option>
        <option value="adotado">Adotado</option>
      </select>
      <label>Foto:</label>
      <input type="file" id="image-upload" onChange={(e) => setImageFile(e.target.files[0])} style={{ padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.25rem' }} />

      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <button type="submit" style={{ flex: '1', padding: '0.75rem', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '0.25rem', cursor: 'pointer' }}>
          {petToEdit ? 'Salvar Alterações' : 'Cadastrar Pet'}
        </button>
        {petToEdit && (
          <button type="button" onClick={onCancel} style={{ flex: '1', padding: '0.75rem', backgroundColor: '#6b7280', color: 'white', border: 'none', borderRadius: '0.25rem', cursor: 'pointer' }}>
            Cancelar
          </button>
        )}
      </div>
      {message && <p style={{ marginTop: '1rem', textAlign: 'center', color: message.includes('sucesso') ? 'green' : 'red' }}>{message}</p>}
    </form>
  );
};

export default PetForm;