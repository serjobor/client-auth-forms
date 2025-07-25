import React from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import styles from './Login.module.css';
import authStore from '../stores/authStore';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Некорректный email').required('Обязательное поле'),
  password: Yup.string().min(4, 'Минимум 4 символа').required('Обязательное поле'),
});

const Login: React.FC = observer(() => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Вход в аккаунт</h2>
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={LoginSchema}
        onSubmit={async (values, { setSubmitting }) => {
          await authStore.login(values.email, values.password);
          setSubmitting(false);
          if (authStore.user) navigate('/');
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <Field type="email" name="email" id="email" />
              <ErrorMessage name="email" component="div" className={styles.error} />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="password">Пароль</label>
              <Field type="password" name="password" id="password" />
              <ErrorMessage name="password" component="div" className={styles.error} />
            </div>
            {authStore.error && <div className={styles.error}>{authStore.error}</div>}
            <button type="submit" className={styles.submitButton} disabled={isSubmitting || authStore.loading}>
              {authStore.loading ? 'Вход...' : 'Войти'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
});

export default Login; 