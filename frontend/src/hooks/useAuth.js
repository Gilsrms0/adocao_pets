import { useState, useEffect } from 'react';

const useAuth = () => {
  const [user, setUser] = useState(null);

  // Efeito para carregar o usuário do localStorage ao iniciar a aplicação
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    // VERIFICA se existe algo no localStorage antes de tentar converter
    if (storedUser) { 
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        // Limpa o localStorage se o JSON estiver inválido
        localStorage.removeItem('user');
        console.error("Could not parse user data from localStorage", e);
      }
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return {
    user,
    handleLogin,
    handleLogout
  };
};

export default useAuth;