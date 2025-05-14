import { Task } from '../../models';
import TaskItem from './TaskItem';

interface TaskGroupProps {
  title: string;
  tasks: Task[];
  onTaskSelect: (task: Task) => void;
}

export default function TaskGroup({ title, tasks, onTaskSelect }: TaskGroupProps) {
  return (
    <div className="task-group">
      <h3 className="group-title">{title}</h3>
      <div className="task-list">
        {tasks.map(task => (
          <TaskItem 
            key={task.id} 
            task={task} 
            onClick={() => onTaskSelect(task)}
          />
        ))}
      </div>
    </div>
  );
}