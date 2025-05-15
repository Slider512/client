import api from './axios';
import { Project } from '../models/Project';

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