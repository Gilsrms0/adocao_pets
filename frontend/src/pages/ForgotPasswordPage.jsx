import React from 'react';
import styles from './ForgotPasswordPage.module.css';

const ForgotPasswordPage = ({ onPageChange }) => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Esqueci Minha Senha</h1>
      <p>
        Para redefinir sua senha, informe o email cadastrado e clique no botão abaixo. Você receberá um link para redefinir sua senha.
      </p>
      <div className={styles['form-group']}>
        <label className={styles.label}>Email:</label>
        <input type="email" className={styles.input} required />
      </div>
      <button className={styles.button}>Enviar link de recuperação</button>
      <div style={{ marginTop: '1rem' }}>
        <a href="#" onClick={() => onPageChange('login')}>Voltar para o Login</a>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;