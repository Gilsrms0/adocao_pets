import React, { useState } from 'react';
import styles from './RegisterPage.module.css';
import api from '../utils/api'; // <-- USANDO API CENTRALIZADA

const RegisterPage = ({ onPageChange }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminKey, setAdminKey] = useState(''); // Estado para a chave de administrador
  const [message, setMessage] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      // Rota de registro. O api.js NÃO injeta o token aqui
      await api.post('/auth/register', {
        name,
        email,
        password,
        adminKey, 
      });
      setMessage('Registro bem-sucedido! Você já pode fazer login.');
      setName('');
      setEmail('');
      setPassword('');
      setAdminKey('');
      
      setTimeout(() => onPageChange('login'), 2000);
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Erro no registro. Verifique se o email já está em uso.';
      setMessage(errorMsg);
      console.error(error);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Cadastro</h1>
      <form onSubmit={handleRegister}>
        <div className={styles['form-group']}>
          <label className={styles.label}>Nome:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={styles.input}
            required
          />
        </div>
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
        <div className={styles['form-group']}>
          <label className={styles.label}>Chave de Admin:</label>
          <input
            type="password"
            value={adminKey}
            onChange={(e) => setAdminKey(e.target.value)}
            className={styles.input}
          />
        </div>
        <button type="submit" className={styles.button}>Cadastrar</button>
      </form>
      {message && <p className={`${styles.message} ${message.includes('sucesso') ? '' : styles.error}`}>{message}</p>}
      <div className={styles.links}>
        <a href="#" onClick={() => onPageChange('login')}>Já tem uma conta? Faça login</a>
      </div>
    </div>
  );
};

export default RegisterPage;