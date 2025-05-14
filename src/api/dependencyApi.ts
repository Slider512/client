import api from './axios';
import { Dependency } from '../models';

export const fetchDependencies = async (): Promise<Dependency[]> => {
  try {
    const response = await api.get<Dependency[]>('/api/dependencies');
    return response.data;
  } catch (error: any) {
    console.error('Fetch Dependencies API error:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch dependencies');
  }
};

export const createDependency = async (dep: Omit<Dependency, 'id'>): Promise<Dependency> => {
  try {
    const response = await api.post<Dependency>('/api/dependencies', dep);
    return response.data;
  } catch (error: any) {
    console.error('Create Dependency API error:', error);
    throw new Error(error.response?.data?.message || 'Failed to create dependency');
  }
};

export const deleteDependency = async (id: string): Promise<void> => {
  try {
    await api.delete(`/api/dependencies/${id}`);
  } catch (error: any) {
    console.error('Delete Dependency API error:', error);
    throw new Error(error.response?.data?.message || 'Failed to delete dependency');
  }
};