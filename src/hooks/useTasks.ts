import { useState, useEffect, useCallback, useMemo } from 'react';
import { Task } from '../models';
import { fetchTasks, createTask, updateTask, deleteTask } from '../api/taskApi';

/**
 * Хук для управления задачами
 */
export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  // Загрузка задач
  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchTasks();
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  // Инициализация
  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // Добавление задачи
  const addTask = useCallback(async (taskData: Omit<Task, 'id'>) => {
    try {
      setLoading(true);
      const newTask = await createTask(taskData);
      setTasks(prev => [...prev, newTask]);
      setSelectedTaskId(newTask.id);
      return newTask;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add task');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Обновление задачи
  const updateTask = useCallback(async (task: Task) => {
    try {
      setLoading(true);
      const updatedTask:Task = await updateTask(task);
      setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
      return updatedTask;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Удаление задачи
  const deleteTask = useCallback(async (taskId: string) => {
    try {
      setLoading(true);
      await deleteTask(taskId);
      setTasks(prev => prev.filter(t => t.id !== taskId));
      if (selectedTaskId === taskId) {
        setSelectedTaskId(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete task');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedTaskId]);

  // Обновление статуса задачи
  const updateTaskStatus = useCallback(async (taskId: string, status: 'Not Started' | 'In Progress' | 'Completed'|undefined) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    try {
      const updatedTask:Task = { ...task, status };
      await updateTask(updatedTask);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task status');
      throw err;
    }
  }, [tasks, updateTask]);

  // Перемещение задачи
  const moveTask = useCallback(async (taskId: string, newIndex: number) => {
    setTasks(prev => {
      const taskIndex = prev.findIndex(t => t.id === taskId);
      if (taskIndex === -1 || taskIndex === newIndex) return prev;
      
      const newTasks = [...prev];
      const [movedTask] = newTasks.splice(taskIndex, 1);
      newTasks.splice(newIndex, 0, movedTask);
      
      return newTasks;
    });
  }, []);

  // Получение выбранной задачи
  const selectedTask = useMemo(() => {
    return tasks.find(task => task.id === selectedTaskId) || null;
  }, [tasks, selectedTaskId]);

  return {
    tasks,
    loading,
    error,
    selectedTask,
    selectedTaskId,
    setSelectedTaskId,
    addTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    moveTask,
    refreshTasks: loadTasks,
    // Оптимизированные селекторы
    getTaskById: useCallback((id: string) => tasks.find(t => t.id === id), [tasks]),
    getTasksByStatus: useCallback((status: string) => 
      tasks.filter(t => t.status === status), [tasks]),
    getTasksByAssignee: useCallback((assignee: string) => 
      tasks.filter(t => t.assignee === assignee), [tasks])
  };
};