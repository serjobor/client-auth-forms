import React from 'react';
import styles from './Header.module.css';

const Header: React.FC = () => (
  <header className={styles.header}>
    <h2 className={styles.title}>Панель пользователя</h2>
  </header>
);

export default Header; 