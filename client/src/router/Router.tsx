import React, { useEffect } from 'react';
import { Routes, Route, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import Login from '../pages/Login';
import Home from '../pages/Home';
import Header from '../components/Header/Header';
import Sidebar from '../components/Sidebar/Sidebar';
import UserForm, { type UserFormValues } from '../pages/UserForm';
import usersStore from '../stores/usersStore';
import authStore from '../stores/authStore';
import { observer } from 'mobx-react-lite';

const Layout: React.FC = observer(() => {
  const navigate = useNavigate();
  useEffect(() => {
    authStore.checkAuth().then(() => {
      if (!authStore.user) navigate('/login');
    });
  }, []);
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div style={{ flex: 1 }}>
        <Header />
        <div style={{ padding: 24 }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
});

const RequireAuth: React.FC<{ children: React.ReactNode }> = observer(({ children }) => {
  const location = useLocation();
  if (authStore.loading) return <div>Проверка авторизации...</div>;
  if (!authStore.user) return <Navigate to="/login" state={{ from: location }} replace />;
  return <>{children}</>;
});

const ModalRoutes: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { backgroundLocation?: Location, userId?: string } | undefined;
  const background = state?.backgroundLocation || location;

  // Для редактирования ищем пользователя по userId из state
  let editInitialValues: UserFormValues | undefined = undefined;
  if (state?.userId) {
    const user = usersStore.all.find(u => u.id === state.userId);
    if (user) {
      editInitialValues = { ...user, userAgreement: Boolean(user.userAgreement) };
    }
  }

  return (
    <>
      <Routes location={background}>
        <Route path="/login" element={<Login />} />
        <Route element={<Layout />}>
          <Route
            path="/"
            element={
              <RequireAuth>
                <Home />
              </RequireAuth>
            }
          />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      {/* Модальные маршруты поверх основного контента */}
      <Routes>
        <Route
          path="/user/create"
          element={
            <UserForm
              mode="create"
              onClose={() => navigate(-1)}
              onSubmit={async (values, helpers) => {
                try {
                  await usersStore.addUser(values);
                  helpers.setSubmitting(false);
                  navigate(-1);
                } catch (e: any) {
                  helpers.setSubmitting(false);
                  helpers.setFieldError('email', e.message || 'Ошибка');
                }
              }}
            />
          }
        />
        <Route
          path="/user/update"
          element={
            <UserForm
              mode="edit"
              initialValues={editInitialValues}
              onClose={() => navigate(-1)}
              onSubmit={async (values, helpers) => {
                try {
                  if (state?.userId) {
                    await usersStore.updateUser(state.userId, values);
                  }
                  helpers.setSubmitting(false);
                  navigate(-1);
                } catch (e: any) {
                  helpers.setSubmitting(false);
                  helpers.setStatus(e.message || 'Ошибка');
                }
              }}
            />
          }
        />
      </Routes>
    </>
  );
};

const Router: React.FC = () => <ModalRoutes />;

export default Router; 