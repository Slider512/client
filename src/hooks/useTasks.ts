import { useState, useCallback, useEffect } from 'react';
import { message } from 'antd';
import { fetchTasks, createTask, updateTask, deleteTask } from '../api/taskApi';
import { Task } from '../models/Task';

interface UseTasksResult {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  fetchTasksByProject: (projectId?: string) => Promise<void>;
  addTask: (task: Omit<Task, 'id'>) => Promise<void>;
  editTask: (task: Task) => Promise<void>;
  removeTask: (id: string) => Promise<void>;
}

export const useTasks = (): UseTasksResult => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Загрузка задач с фильтрацией по projectId
  const fetchTasksByProject = useCallback(async (projectId?: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTasks(projectId);
      setTasks(data);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch tasks';
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Добавление задачи
  const addTask = useCallback(async (task: Omit<Task, 'id'>) => {
    setLoading(true);
    setError(null);
    try {
      const newTask = await createTask(task);
      setTasks((prev) => [...prev, newTask]);
      message.success('Task created successfully');
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to create task';
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Обновление задачи
  const editTask = useCallback(async (task: Task) => {
    setLoading(true);
    setError(null);
    try {
      const updatedTask = await updateTask(task);
      setTasks((prev) =>
        prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
      );
      message.success('Task updated successfully');
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to update task';
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Удаление задачи
  const removeTask = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      message.success('Task deleted successfully');
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to delete task';
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    tasks,
    loading,
    error,
    fetchTasksByProject,
    addTask,
    editTask,
    removeTask,
  };
};