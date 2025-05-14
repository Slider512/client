import { Dependency } from '../models';

const API_URL = 'http://localhost:5000/api/dependencies';

export const fetchDependencies = async (): Promise<Dependency[]> => {
  const response = await fetch(API_URL);
  return response.json();
};

export const createDependency = async (dep: Omit<Dependency, 'id'>): Promise<Dependency> => {
  const response = await fetch(API_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dep)
  });
  return response.json();
};

export const deleteDependency = async (id: string): Promise<void> => {
  await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
};