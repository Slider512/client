import api from './axios';
import { Task } from '../models';

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