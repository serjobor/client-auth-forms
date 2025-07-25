import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import usersStore from '../stores/usersStore';
import styles from './Home.module.css';

const Home: React.FC = observer(() => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    usersStore.fetchUsers();
  }, []);

  if (usersStore.loading) return <div>Загрузка пользователей...</div>;
  if (usersStore.error) return <div style={{color: 'red'}}>Ошибка: {usersStore.error}</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Вход выполнен</h1>
      </header>
      <div className={styles.layout}>
        <main className={styles.main}>
          <table className={styles.table}>
            <thead>
              <tr>
                {/* <th>name</th> */}
                {/* <th>surName</th> */}
                <th>fullName</th>
                <th>email</th>
                <th>password</th>
                <th>birthDate</th>
                <th>telephone</th>
                <th>employment</th>
                <th>userAgreement</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {usersStore.all.map(user => (
                <tr key={user.id}>
                  {/* <td>{user.name || '-'}</td> */}
                  {/* <td>{user.surName || '-'}</td> */}
                  <td>{user.fullName || '-'}</td>
                  <td>{user.email || '-'}</td>
                  <td>{user.password || '-'}</td>
                  <td>{user.birthDate || '-'}</td>
                  <td>{user.telephone || '-'}</td>
                  <td>{user.employment || '-'}</td>
                  <td>{user.userAgreement ? 'Да' : '-'}</td>
                  <td>
                    <button
                      className={styles.editButton}
                      onClick={() => navigate('/user/update', { state: { backgroundLocation: location, userId: user.id } })}
                    >
                      Изменить
                    </button>
                  </td>
                  <td>
                    <button
                      className={styles.deleteButton}
                      onClick={() => usersStore.removeUser(user.id)}
                    >
                      Удалить
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </main>
      </div>
    </div>
  );
});

export default Home; 