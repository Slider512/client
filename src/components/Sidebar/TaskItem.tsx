import React from 'react';
import { Task } from '../../models';
import { StatusBadge } from '../common/StatusBadge';
import { formatDate } from '../../utils/dateUtils';

interface TaskItemProps {
  task: Task;
  onClick: (task: Task) => void;
  isSelected?: boolean;
}

export default function TaskItem({ task, onClick, isSelected }: TaskItemProps) {
  return (
    <div 
      className={`task-item ${isSelected ? 'selected' : ''}`}
      onClick={() => onClick(task)}
    >
      <div className="task-item-header">
        <h4>{task.title}</h4>
        <StatusBadge status={task.status || 'Not Started'} />
      </div>
      <div className="task-item-dates">
        <span>{formatDate(task.startDate, 'MMM dd')}</span>
        <span> - </span>
        <span>{formatDate(task.endDate, 'MMM dd')}</span>
      </div>
      <div className="task-item-progress">
        <div 
          className="progress-bar"
          style={{ width: `${task.progress}%` }}
        />
        <span>{task.progress}%</span>
      </div>
      {task.assignee && (
        <div className="task-item-assignee">
          <span>Assignee: </span>
          <strong>{task.assignee}</strong>
        </div>
      )}
    </div>
  );
}