import React, { useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage, type FormikHelpers } from 'formik';
import * as Yup from 'yup';
import styles from './UserForm.module.css';

export type UserFormMode = 'create' | 'edit';

interface UserFormProps {
  mode: UserFormMode;
  initialValues?: UserFormValues;
  onClose: () => void;
  onSubmit: (values: UserFormValues, helpers: FormikHelpers<UserFormValues>) => void;
}

export interface UserFormValues {
  name: string;
  surName: string;
  fullName: string;
  email: string;
  password: string;
  birthDate: string;
  telephone: string;
  employment: 'трудоустроен' | 'не трудоустроен' | '';
  userAgreement: boolean;
}

const defaultInitialValues: UserFormValues = {
  name: '',
  surName: '',
  fullName: '',
  email: '',
  password: '',
  birthDate: '',
  telephone: '',
  employment: '',
  userAgreement: false,
};

const UserFormSchema = (mode: UserFormMode) =>
  Yup.object().shape({
    name: Yup.string().max(64, 'Максимум 64 символа').required('Обязательное поле'),
    surName: Yup.string().max(64, 'Максимум 64 символа').required('Обязательное поле'),
    fullName: Yup.string().required(),
    email: mode === 'create' ? Yup.string().email('Некорректный email').required('Обязательное поле') : Yup.string(),
    password: mode === 'create' ? Yup.string().min(4, 'Минимум 4 символа').required('Обязательное поле') : Yup.string(),
    birthDate: Yup.string().required('Обязательное поле'),
    telephone: Yup.string().matches(/^\d{11}$/, '11 цифр').required('Обязательное поле'),
    employment: Yup.string().oneOf(['трудоустроен', 'не трудоустроен'], 'Выберите вариант').required('Обязательное поле'),
    userAgreement: Yup.boolean().oneOf([true], 'Необходимо согласие'),
  });

const UserForm: React.FC<UserFormProps> = ({ mode, initialValues, onClose, onSubmit }) => {
  return (
    <div className={styles.modal}>
      <div className={styles.formWrapper}>
        <div className={styles.title}>{mode === 'create' ? 'Добавить пользователя' : 'Изменить пользователя'}</div>
        <Formik
          initialValues={initialValues || defaultInitialValues}
          validationSchema={UserFormSchema(mode)}
          onSubmit={onSubmit}
        >
          {({ values, setFieldValue, isSubmitting, status }) => {
            useEffect(() => {
              setFieldValue('fullName', `${values.name} ${values.surName}`.trim());
            }, [values.name, values.surName]);
            return (
              <Form>
                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="name">Имя <span style={{color: 'red'}}>*</span></label>
                  <Field className={styles.input} name="name" maxLength={64} />
                  <ErrorMessage name="name" component="div" className={styles.error} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="surName">Фамилия <span style={{color: 'red'}}>*</span></label>
                  <Field className={styles.input} name="surName" maxLength={64} />
                  <ErrorMessage name="surName" component="div" className={styles.error} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="fullName">Полное имя <span style={{color: 'red'}}>*</span></label>
                  <Field className={styles.input} name="fullName" readOnly />
                </div>
                {/* Email и пароль только для создания */}
                {mode === 'create' && (
                  <>
                    <div className={styles.formGroup}>
                      <label className={styles.label} htmlFor="email">Email <span style={{color: 'red'}}>*</span></label>
                      <Field className={styles.input} name="email" type="email" />
                      <ErrorMessage name="email" component="div" className={styles.error} />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label} htmlFor="password">Пароль <span style={{color: 'red'}}>*</span></label>
                      <Field className={styles.input} name="password" type="password" />
                      <ErrorMessage name="password" component="div" className={styles.error} />
                    </div>
                  </>
                )}
                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="birthDate">Дата рождения <span style={{color: 'red'}}>*</span></label>
                  <Field className={styles.input} name="birthDate" type="date" />
                  <ErrorMessage name="birthDate" component="div" className={styles.error} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="telephone">Телефон <span style={{color: 'red'}}>*</span></label>
                  <Field className={styles.input} name="telephone" maxLength={11} />
                  <ErrorMessage name="telephone" component="div" className={styles.error} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="employment">Трудоустройство <span style={{color: 'red'}}>*</span></label>
                  <Field as="select" className={styles.select} name="employment">
                    <option value="">Выберите...</option>
                    <option value="трудоустроен">Трудоустроен</option>
                    <option value="не трудоустроен">Не трудоустроен</option>
                  </Field>
                  <ErrorMessage name="employment" component="div" className={styles.error} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    <Field type="checkbox" className={styles.checkbox} name="userAgreement" />
                    Согласен на обработку данных <span style={{color: 'red'}}>*</span>
                  </label>
                  <ErrorMessage name="userAgreement" component="div" className={styles.error} />
                </div>
                <div className={styles.buttonRow}>
                  <button type="submit" className={styles.button} disabled={isSubmitting}>
                    {mode === 'create' ? 'Добавить' : 'Изменить'}
                  </button>
                  <button type="button" className={`${styles.button} ${styles.secondary}`} onClick={onClose}>
                    Закрыть
                  </button>
                </div>
                {status && <div className={styles.error} style={{marginTop: 12}}>{status}</div>}
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};

export default UserForm; 