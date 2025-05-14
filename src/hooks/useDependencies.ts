import { useState, useEffect, useCallback } from 'react';
import { Dependency } from '../models';
import { fetchDependencies, createDependency, deleteDependency } from '../api/dependencyApi';

export default function useDependencies() {
  const [dependencies, setDependencies] = useState<Dependency[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDependencies = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchDependencies();
      setDependencies(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dependencies');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDependencies();
  }, [loadDependencies]);

  const addDependency = async (dependency: Omit<Dependency, 'id'>) => {
    try {
      const newDependency = await createDependency(dependency);
      setDependencies(prev => [...prev, newDependency]);
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add dependency';
      setError(message);
      return { success: false, error: message };
    }
  };

  const removeDependency = async (id: string) => {
    try {
      await deleteDependency(id);
      setDependencies(prev => prev.filter(d => d.id !== id));
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to remove dependency';
      setError(message);
      return { success: false, error: message };
    }
  };

  const getDependenciesForTask = useCallback((taskId: string) => {
    return dependencies.filter(
      dep => dep.fromTaskId === taskId || dep.toTaskId === taskId
    );
  }, [dependencies]);

  return {
    dependencies,
    loading,
    error,
    addDependency,
    removeDependency,
    getDependenciesForTask,
    refreshDependencies: loadDependencies
  };
}