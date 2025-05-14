import api from './axios';
import { Task } from '../models';

// Функция для получения токена из localStorage
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

// Интерсептор для обработки ошибок авторизации
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('Unauthorized: Please log in again.');
    }
    return Promise.reject(error);
  }
);

export const fetchTasks = async (): Promise<Task[]> => {
  try {
    const response = await api.get<Task[]>('/api/tasks');
    return response.data;
  } catch (error: any) {
    console.error('Fetch Tasks API error:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch tasks');
  }
};

export const createTask = async (task: Omit<Task, 'id'>): Promise<Task> => {
  try {
    const response = await api.post<Task>('/api/tasks', task);
    return response.data;
  } catch (error: any) {
    console.error('Create Task API error:', error);
    throw new Error(error.response?.data?.message || 'Failed to create task');
  }
};

export const updateTask = async (task: Task): Promise<Task> => {
  try {
    const response = await api.put<Task>(`/api/tasks/${task.id}`, task);
    return response.data;
  } catch (error: any) {
    console.error('Update Task API error:', error);
    throw new Error(error.response?.data?.message || 'Failed to update task');
  }
};

export const deleteTask = async (id: string): Promise<void> => {
  try {
    await api.delete(`/api/tasks/${id}`);
  } catch (error: any) {
    console.error('Delete Task API error:', error);
    throw new Error(error.response?.data?.message || 'Failed to delete task');
  }
};