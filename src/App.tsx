import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { AuthProvider, useAuth } from './auth/AuthContext';
import ProtectedRoute from './auth/ProtectedRoute';
import Layout from './components/Layout'; // Импортируем Layout
import DashboardPage from './pages/DashboardPage';
import TaskBoardPage from './pages/TaskBoardPage';
import LoginPage from './pages/LoginPage';
import LogoutPage from './pages/LogoutPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';
import ConfirmEmailPage from './pages/ConfirmEmailPage';
import { Provider } from 'react-redux';
import store from './store';
import './styles/App.css';
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider  } from 'react-dnd';
import { useEffect } from 'react';

// Главный компонент приложения
const App: React.FC = () => {

  return (
    <Provider store={store}>  
        <DndProvider backend={HTML5Backend}>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: '#1890ff',
                borderRadius: 8,
                fontFamily: "'Inter', sans-serif",
              },
            }}
          >
            <AuthProvider>
                <AppRoutes />
            </AuthProvider>
          </ConfigProvider>
        </DndProvider>
    </Provider>
  );
};

// Компонент маршрутизации
const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const authContext = useAuth();

  // Передаём authContext и navigate в глобальный объект
  useEffect(() => {
    window.__authContext = authContext;
    window.__navigate = navigate;
    return () => {
      delete window.__authContext;
      delete window.__navigate;
    };
  }, [authContext, navigate]);
  
  return (
    <Routes>
      {/* Публичные маршруты (без Layout) */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/logout" element={<LogoutPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/confirm-email" element={<ConfirmEmailPage />} />
      {/* Защищенные маршруты (с Layout) */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout>
              <DashboardPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/tasks"
        element={
          <ProtectedRoute>
            <Layout>
              <TaskBoardPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Перенаправление для авторизованных пользователей */}
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />}
      />

      {/* Обработка неизвестных маршрутов */}
      <Route
        path="*"
        element={
          <Layout>
            <NotFoundPage />
          </Layout>
        }
      />
    </Routes>
  );
};

export default App;

// Объявляем глобальные переменные для TypeScript
declare global {
  interface Window {
    __authContext?: ReturnType<typeof useAuth>;
    __navigate?: ReturnType<typeof useNavigate>;
  }
}