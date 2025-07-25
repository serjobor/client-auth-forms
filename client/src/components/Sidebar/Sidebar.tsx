import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './Sidebar.module.css';
import authStore from '../../stores/authStore';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await authStore.logout();
    navigate('/login');
  };

  return (
    <aside className={styles.sidebar}>
      <nav>
        <button className={styles.navButton} onClick={() => navigate('/')}>Главная</button>
        <button className={styles.navButton} onClick={() => navigate('/user/create', { state: { backgroundLocation: location } })}>Добавить пользователя</button>
        <button className={styles.navButton} onClick={handleLogout}>Выход</button>
      </nav>
    </aside>
  );
};

export default Sidebar; 