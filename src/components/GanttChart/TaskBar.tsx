import React from 'react';
import { useDrag } from 'react-dnd';
import { Task } from '../../models';
import { StatusBadge } from '../common/StatusBadge';
import { formatDate } from '../../utils/dateUtils';
import '../../styles/TaskBar.css';

interface TaskBarProps {
  task: Task;
  position: {
    left: number;
    top: number;
    width: number;
    height: number;
  };
  isSelected?: boolean;
  onClick?: () => void;
  onDoubleClick?: () => void;
}

export const TaskBar: React.FC<TaskBarProps> = ({
  task,
  position,
  isSelected = false,
  onClick,
  onDoubleClick
}) => {
  const [{ isDragging }, dragRef] = useDrag({
    type: 'TASK',
    item: { id: task.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    })
  });

  // Определяем цвет в зависимости от статуса и приоритета
  const getTaskColor = () => {
    if (task.priority === 'High') return '#ff4d4f';
    if (task.priority === 'Medium') return '#faad14';
    if (task.status === 'Completed') return '#52c41a';
    if (task.status === 'In Progress') return '#1890ff';
    return '#d9d9d9';
  };

  const barColor = getTaskColor();
  const textColor = '#ffffff'; // Белый текст для лучшей читаемости

  return (
    dragRef(<div
      className={`task-bar ${isSelected ? 'selected' : ''}`}
      style={{
        left: `${position.left}px`,
        top: `${position.top}px`,
        width: `${Math.max(20, position.width)}px`,
        height: `${position.height}px`,
        backgroundColor: barColor,
        color: textColor,
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
        zIndex: isSelected ? 10 : 1
      }}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      data-task-id={task.id}
      title={`${task.title}\n${formatDate(task.startDate)} - ${formatDate(task.endDate)}\nStatus: ${task.status || 'Not Started'}`}
    >
      <div className="task-bar-content">
        {/* Основное содержимое полоски задачи */}
        <div className="task-bar-label">
          {task.title}
        </div>
        
        {/* Прогресс */}
        {task.progress > 0 && (
          <div className="task-progress" style={{
            width: `${task.progress}%`,
            backgroundColor: 'rgba(255, 255, 255, 0.3)'
          }} />
        )}

        {/* Статус */}
        <div className="task-status">
          <StatusBadge 
            status={task.status || 'Not Started'} 
            size="small"
            style={{
              position: 'absolute',
              right: '4px',
              top: '4px',
              filter: 'brightness(0.8)'
            }}
          />
        </div>

        {/* Ресайзеры (только для выбранной задачи) */}
        {isSelected && (
          <>
            <div className="task-resizer left" />
            <div className="task-resizer right" />
          </>
        )}
      </div>
    </div>)
  );
};