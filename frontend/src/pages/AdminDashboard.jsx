import React, { useState } from 'react';
import AdminPetList from '../components/AdminPetList.jsx';
import PetForm from '../components/PetForm.jsx';
import AdminAdotanteList from '../components/AdminAdotanteList.jsx';
import AdotanteForm from '../components/AdotanteForm.jsx';

const AdminDashboard = ({ user }) => {
  const [activeTab, setActiveTab] = useState('pets');
  const [selectedPet, setSelectedPet] = useState(null);
  const [selectedAdotante, setSelectedAdotante] = useState(null);

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', fontSize: '2.5rem', color: '#1f2937' }}>
        Painel de Administração
      </h1>
      <p style={{ textAlign: 'center', color: '#4b5563' }}>
        Olá, **{user.name}**! Gerencie os dados do sistema.
      </p>

      <nav style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}>
        <button
          onClick={() => { setActiveTab('pets'); setSelectedPet(null); }}
          style={{ padding: '0.75rem 1.5rem', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 'bold', backgroundColor: activeTab === 'pets' ? '#3b82f6' : '#e5e7eb', color: activeTab === 'pets' ? 'white' : '#4b5563' }}
        >
          Gerenciar Pets
        </button>
        <button
          onClick={() => { setActiveTab('adotantes'); setSelectedAdotante(null); }}
          style={{ padding: '0.75rem 1.5rem', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 'bold', backgroundColor: activeTab === 'adotantes' ? '#3b82f6' : '#e5e7eb', color: activeTab === 'adotantes' ? 'white' : '#4b5563' }}
        >
          Gerenciar Adotantes
        </button>
      </nav>

      <div style={{ marginTop: '2rem', backgroundColor: 'white', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        {activeTab === 'pets' && (
          <>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem' }}>
              {selectedPet ? 'Editar Pet' : 'Cadastrar Novo Pet'}
            </h2>
            <PetForm
              // token removido, pois o api.js lida com isso
              petToEdit={selectedPet}
              onCancel={() => setSelectedPet(null)}
            />
            <hr style={{ margin: '2rem 0' }} />
            <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem' }}>Lista de Pets</h2>
            <AdminPetList
              // token removido, pois o api.js lida com isso
              onEditClick={setSelectedPet}
            />
          </>
        )}

        {activeTab === 'adotantes' && (
          <>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem' }}>
              {selectedAdotante ? 'Editar Adotante' : 'Cadastrar Novo Adotante'}
            </h2>
            <AdotanteForm
              // token removido, pois o api.js lida com isso
              adotanteToEdit={selectedAdotante}
              onCancel={() => setSelectedAdotante(null)}
            />
            <hr style={{ margin: '2rem 0' }} />
            <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem' }}>Lista de Adotantes</h2>
            <AdminAdotanteList
              // token removido, pois o api.js lida com isso
              onEditClick={setSelectedAdotante}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;