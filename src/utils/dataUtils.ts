import { Task } from '../models';

/**
 * Группирует задачи по выбранному критерию
 * @param tasks Массив задач
 * @param groupBy Критерий группировки ('none' | 'status' | 'assignee')
 * @returns Объект сгруппированных задач
 */
export const applyGrouping = (
  tasks: Task[],
  groupBy: string
): Record<string, Task[]> => {
  if (groupBy === 'none') {
    return { 'All Tasks': tasks };
  }

  return tasks.reduce((acc, task:any) => {
    // Получаем значение для группировки
    const groupValue = task[groupBy] || `No ${groupBy}`;
    
    // Если группы еще нет, создаем ее
    if (!acc[groupValue]) {
      acc[groupValue] = [];
    }
    
    // Добавляем задачу в соответствующую группу
    acc[groupValue].push(task);
    
    return acc;
  }, {} as Record<string, Task[]>);
};

/**
 * Сортирует задачи по выбранному критерию
 * @param tasks Массив задач
 * @param sortConfig Конфигурация сортировки { key: ключ поля, direction: направление }
 * @returns Отсортированный массив задач
 */
export const applySorting = (
  tasks: Task[],
  sortConfig: { key: string; direction: 'asc' | 'desc' } | undefined
): Task[] => {
  if (!sortConfig) return [...tasks];

  return [...tasks].sort((a, b) => {
    // Получаем значения для сравнения
    const aValue = (a as any)[sortConfig.key];
    const bValue = (b as any)[sortConfig.key];

    // Для строк
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortConfig.direction === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    // Для дат
    if (aValue instanceof Date && bValue instanceof Date) {
      return sortConfig.direction === 'asc'
        ? aValue.getTime() - bValue.getTime()
        : bValue.getTime() - aValue.getTime();
    }

    // Для чисел
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortConfig.direction === 'asc'
        ? aValue - bValue
        : bValue - aValue;
    }

    // Для остальных случаев
    return 0;
  });
};

// Дополнительная утилита для сортировки с учетом вложенности
export const applySortingWithGroups = (
  groupedTasks: Record<string, Task[]>,
  sortConfig: { key: keyof Task; direction: 'asc' | 'desc' }
): Record<string, Task[]> => {
  const result: Record<string, Task[]> = {};

  for (const [groupName, tasks] of Object.entries(groupedTasks)) {
    result[groupName] = applySorting(tasks, sortConfig);
  }

  return result;
};

export const applyFilters = (
  tasks: Task[],
  filters: { assignee: string; status: string; priority: string }
): Task[] => {
  return tasks.filter(task => {
    const assigneeMatch = filters.assignee 
      ? task.assignee?.includes(filters.assignee) 
      : true;
    const statusMatch = filters.status 
      ? task.status === filters.status 
      : true;
    const priorityMatch = filters.priority 
      ? task.priority === filters.priority 
      : true;
    
    return assigneeMatch && statusMatch && priorityMatch;
  });
};