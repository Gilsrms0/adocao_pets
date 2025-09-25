// src/utils/api.js

import axios from 'axios';

// Cria uma instância do Axios com a URL base
const api = axios.create({
  // Configura a URL base para todas as chamadas. Seu Backend roda na 3001.
  baseURL: 'http://localhost:3001/api', 
});

// Interceptor de Requisição: Adiciona o token antes de enviar
api.interceptors.request.use(
  (config) => {
    // Rotas de autenticação (login/register) não devem enviar o token
    const isAuthRoute = config.url.includes('/auth/'); 
    
    if (!isAuthRoute) {
      const token = localStorage.getItem('token');
      if (token) {
        // Adiciona o token no formato Bearer
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;