export type DependencyType = 'FS' | 'FF' | 'SS' | 'SF';

export interface Dependency {
  id: string;
  fromTaskId: string;
  toTaskId: string;
  type: DependencyType;
  lag?: number; // Опциональная задержка в днях
}

export const dependencyTypes = [
  { value: 'FS', label: 'Finish-to-Start (FS)' },
  { value: 'FF', label: 'Finish-to-Finish (FF)' },
  { value: 'SS', label: 'Start-to-Start (SS)' },
  { value: 'SF', label: 'Start-to-Finish (SF)' }
];

export const getDependencyLabel = (type: DependencyType): string => {
  return dependencyTypes.find(dt => dt.value === type)?.label || type;
};

export const validateDependency = (
  dependency: Omit<Dependency, 'id'>,
  tasks: { id: string }[],
  existingDependencies: Dependency[]
): { valid: boolean; message?: string } => {
  // Проверка существования задач
  const fromTaskExists = tasks.some(t => t.id === dependency.fromTaskId);
  const toTaskExists = tasks.some(t => t.id === dependency.toTaskId);
  
  if (!fromTaskExists || !toTaskExists) {
    return { valid: false, message: 'Одна из задач не найдена' };
  }

  // Проверка на циклические зависимости
  if (dependency.fromTaskId === dependency.toTaskId) {
    return { valid: false, message: 'Нельзя создать зависимость задачи на саму себя' };
  }

  // Проверка на дублирование зависимостей
  const isDuplicate = existingDependencies.some(
    d => d.fromTaskId === dependency.fromTaskId && 
         d.toTaskId === dependency.toTaskId
  );
  
  if (isDuplicate) {
    return { valid: false, message: 'Такая зависимость уже существует' };
  }

  return { valid: true };
};

export const calculateDependencyDates = (
  fromTask: { startDate: string; endDate: string },
  toTask: { startDate: string; endDate: string },
  type: DependencyType,
  lag = 0
): { startDate: string; endDate: string } => {
  const fromStart = new Date(fromTask.startDate);
  const fromEnd = new Date(fromTask.endDate);
  const toStart = new Date(toTask.startDate);
  const toEnd = new Date(toTask.endDate);

  const result = { startDate: toTask.startDate, endDate: toTask.endDate };

  switch (type) {
    case 'FS': // Finish-to-Start
      result.startDate = new Date(
        fromEnd.getTime() + lag * 24 * 60 * 60 * 1000
      ).toISOString();
      break;
      
    case 'FF': // Finish-to-Finish
      result.endDate = new Date(
        fromEnd.getTime() + lag * 24 * 60 * 60 * 1000
      ).toISOString();
      break;
      
    case 'SS': // Start-to-Start
      result.startDate = new Date(
        fromStart.getTime() + lag * 24 * 60 * 60 * 1000
      ).toISOString();
      break;
      
    case 'SF': // Start-to-Finish
      result.endDate = new Date(
        fromStart.getTime() + lag * 24 * 60 * 60 * 1000
      ).toISOString();
      break;
  }

  return result;
};

export const checkDependencyConflict = (
  dependency: Dependency,
  tasks: { id: string; startDate: string; endDate: string }[]
): { hasConflict: boolean; message?: string } => {
  const fromTask = tasks.find(t => t.id === dependency.fromTaskId);
  const toTask = tasks.find(t => t.id === dependency.toTaskId);

  if (!fromTask || !toTask) {
    return { hasConflict: true, message: 'Одна из задач не найдена' };
  }

  const fromStart = new Date(fromTask.startDate);
  const fromEnd = new Date(fromTask.endDate);
  const toStart = new Date(toTask.startDate);
  const toEnd = new Date(toTask.endDate);

  const lagDays = dependency.lag || 0;
  const lagMs = lagDays * 24 * 60 * 60 * 1000;

  switch (dependency.type) {
    case 'FS':
      if (fromEnd.getTime() + lagMs > toStart.getTime()) {
        return { 
          hasConflict: true,
          message: `Задача не может начаться раньше ${lagDays} дней после окончания предыдущей`
        };
      }
      break;
      
    case 'FF':
      if (fromEnd.getTime() + lagMs > toEnd.getTime()) {
        return { 
          hasConflict: true,
          message: `Задача не может закончиться раньше ${lagDays} дней после окончания предыдущей`
        };
      }
      break;
      
    case 'SS':
      if (fromStart.getTime() + lagMs > toStart.getTime()) {
        return { 
          hasConflict: true,
          message: `Задача не может начаться раньше ${lagDays} дней после начала предыдущей`
        };
      }
      break;
      
    case 'SF':
      if (fromStart.getTime() + lagMs > toEnd.getTime()) {
        return { 
          hasConflict: true,
          message: `Задача не может закончиться раньше ${lagDays} дней после начала предыдущей`
        };
      }
      break;
  }

  return { hasConflict: false };
};