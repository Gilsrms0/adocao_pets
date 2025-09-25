import React, { useState } from 'react';
import Header from './components/Header.jsx';
import HomePage from './pages/HomePage.jsx';
import PetList from './pages/PetList.jsx';
import AdotanteList from './pages/AdotanteList.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx';
import useAuth from './hooks/useAuth.js';

const App = () => {
  const { user, handleLogin, handleLogout } = useAuth();
  
  // Define a página inicial com base no estado do usuário
  const [currentPage, setCurrentPage] = useState(user ? (user.role === 'ADM' ? 'admin-dashboard' : 'pets') : 'home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'pets':
        return <PetList />;
      case 'adotantes':
        return <AdotanteList />;
      case 'admin-dashboard':
        return user && user.role === 'ADM' ? <AdminDashboard user={user} /> : <p>Acesso negado.</p>;
      case 'login':
        return <LoginPage onPageChange={setCurrentPage} onLoginSuccess={handleLogin} />;
      case 'register':
        return <RegisterPage onPageChange={setCurrentPage} />;
      case 'forgot-password':
        return <ForgotPasswordPage onPageChange={setCurrentPage} />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div>
      <Header
        onNavigate={setCurrentPage}
        user={user}
        onLogout={handleLogout}
      />
      <main style={{ padding: '1rem' }}>{renderPage()}</main>
    </div>
  );
};

export default App;