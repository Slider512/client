import api from './axios';
import { Project } from '../models/Project';

const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

// Интерсептор для добавления токена в заголовок Authorization
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Интерсептор для обработки ошибок, включая 401 с обновлением токена
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const authContext = window.__authContext;
      const navigate = window.__navigate;

      try {
        console.warn('401 Unauthorized: Attempting to refresh token...');

        // Получаем контекст аутентификации
        

        if (!authContext) {
          throw new Error('Auth context not available');
        }

        // Обновляем токен
        await authContext.callrefreshToken();

        // Обновляем заголовок Authorization для исходного запроса
        const newToken = localStorage.getItem('authToken');
        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }

        // Повторяем исходный запрос
        return api(originalRequest);
      } catch (refreshError) {
        console.error('Failed to refresh token:', refreshError);
        if (authContext) {
          authContext.logout();
          if (navigate) {
            navigate('/login', {
              state: { from: window.location.pathname },
            });
          } else {
            window.location.href = '/login';
          }
        }
        return Promise.reject(new Error('Unauthorized: Redirecting to login'));
      }
    }

    return Promise.reject(error);
  }
);

export const fetchProjects = async (): Promise<Project[]> => {
  try {
    const response = await api.get<Project[]>('/api/projects');
    return response.data;
  } catch (error: any) {
    console.error('Fetch Projects API error:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch projects');
  }
};

export const createProject = async (project: Omit<Project, 'id' | 'createdAt'>): Promise<Project> => {
  try {
    const response = await api.post<Project>('/api/projects', project);
    return response.data;
  } catch (error: any) {
    console.error('Create Project API error:', error);
    throw new Error(error.response?.data?.message || 'Failed to create project');
  }
};

export const deleteProject = async (id: string): Promise<void> => {
  try {
    await api.delete(`/api/projects/${id}`);
  } catch (error: any) {
    console.error('Delete Project API error:', error);
    throw new Error(error.response?.data?.message || 'Failed to delete project');
  }
};