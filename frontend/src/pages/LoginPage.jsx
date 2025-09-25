import React, { useState } from 'react';
import styles from './LoginPage.module.css';
import api from '../utils/api'; // <-- USANDO API CENTRALIZADA

const LoginPage = ({ onPageChange, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Rota de login. O api.js NÃO injeta o token aqui
      const response = await api.post('/auth/login', { email, password });
      
      const { token } = response.data; // O backend deve retornar apenas o token
      
      // Decodificando o token para obter o role e name (assumindo JWT)
      const payloadBase64 = token.split('.')[1];
      const decodedPayload = JSON.parse(atob(payloadBase64));
      
      const userRole = decodedPayload.role;
      const userName = decodedPayload.name;

      // Armazena o token no localStorage
      localStorage.setItem('token', token); 
      
      onLoginSuccess({ token, role: userRole, name: userName });

      if (userRole === 'ADM') {
        onPageChange('admin-dashboard');
      } else {
        onPageChange('pets');
      }

    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Erro no login. Verifique suas credenciais.';
      setMessage(errorMsg);
      console.error(error);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Login</h1>
      <form onSubmit={handleLogin}>
        <div className={styles['form-group']}>
          <label className={styles.label}>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
            required
          />
        </div>
        <div className={styles['form-group']}>
          <label className={styles.label}>Senha:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
            required
          />
        </div>
        <button type="submit" className={styles.button}>Entrar</button>
      </form>
      {message && <p className={`${styles.message} ${message.includes('Erro') ? styles.error : ''}`}>{message}</p>}
      <div className={styles.links}>
        <a href="#" onClick={() => onPageChange('register')}>Não tem uma conta?</a>
        <a href="#" onClick={() => onPageChange('forgot-password')}>Esqueci minha senha</a>
      </div>
    </div>
  );
};

export default LoginPage;