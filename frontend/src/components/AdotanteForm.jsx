import React, { useState, useEffect } from 'react';
// import axios from 'axios'; <-- REMOVIDO
import api from '../utils/api'; // <-- USANDO API CENTRALIZADA

const AdotanteForm = ({ adotanteToEdit, onCancel }) => { // <-- REMOVIDO 'token' das props
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState(''); // <-- NOVO CAMPO OBRIGATÓRIO
  const [imageFile, setImageFile] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (adotanteToEdit) {
      setName(adotanteToEdit.name);
      setEmail(adotanteToEdit.email);
      setPhone(adotanteToEdit.phone || '');
      setAddress(adotanteToEdit.address || ''); // <-- SETANDO ENDEREÇO
    } else {
      setName('');
      setEmail('');
      setPhone('');
      setAddress(''); // <-- LIMPA ENDEREÇO
    }
  }, [adotanteToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('phone', phone);
    formData.append('address', address); // <-- ADICIONANDO ENDEREÇO
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      if (adotanteToEdit) {
        // Atualizar. Token injetado.
        await api.put(`/adotantes/${adotanteToEdit.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setMessage('Adotante atualizado com sucesso!');
        onCancel(); 
      } else {
        // Cadastrar. Token injetado.
        await api.post('/adotantes', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setMessage('Adotante cadastrado com sucesso!');
        setName('');
        setEmail('');
        setPhone('');
        setAddress('');
        setImageFile(null);
        document.getElementById('adotante-image-upload').value = ''; 
      }
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Erro ao salvar o adotante. Verifique os dados.';
      setMessage(errorMsg);
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <input type="text" placeholder="Nome" value={name} onChange={(e) => setName(e.target.value)} required style={{ padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.25rem' }} />
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.25rem' }} />
      <input type="tel" placeholder="Telefone" value={phone} onChange={(e) => setPhone(e.target.value)} required style={{ padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.25rem' }} />
      <input type="text" placeholder="Endereço" value={address} onChange={(e) => setAddress(e.target.value)} required style={{ padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.25rem' }} /> {/* <-- NOVO INPUT */}
      <label>Foto:</label>
      <input type="file" id="adotante-image-upload" onChange={(e) => setImageFile(e.target.files[0])} style={{ padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.25rem' }} />
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <button type="submit" style={{ flex: '1', padding: '0.75rem', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '0.25rem', cursor: 'pointer' }}>
          {adotanteToEdit ? 'Salvar Alterações' : 'Cadastrar Adotante'}
        </button>
        {adotanteToEdit && (
          <button type="button" onClick={onCancel} style={{ flex: '1', padding: '0.75rem', backgroundColor: '#6b7280', color: 'white', border: 'none', borderRadius: '0.25rem', cursor: 'pointer' }}>
            Cancelar
          </button>
        )}
      </div>
      {message && <p style={{ marginTop: '1rem', textAlign: 'center', color: message.includes('sucesso') ? 'green' : 'red' }}>{message}</p>}
    </form>
  );
};

export default AdotanteForm;