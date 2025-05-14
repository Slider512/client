import React, { useState } from 'react';
import { Task } from '../../models';
import TaskGroup from './TaskGroup';
import TaskItem from './TaskItem';
import '../../styles/sidebar.css';

interface SidebarProps {
  tasks: Record<string, Task[]>;
  onTaskSelect: (task: Task) => void;
  selectedTaskId?: string;
}

export default function Sidebar({ 
  tasks, 
  onTaskSelect,
  selectedTaskId 
}: SidebarProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredGroups = Object.entries(tasks).reduce((acc, [groupName, groupTasks]) => {
    const filtered = groupTasks.filter(task =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.assignee?.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    
    if (filtered.length > 0) {
      acc[groupName] = filtered;
    }
    
    return acc;
  }, {} as Record<string, Task[]>);

  return (
    <div className="sidebar">
      <div className="sidebar-search">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="sidebar-groups">
        {Object.entries(filteredGroups).map(([groupName, groupTasks]) => (
          <div key={groupName} className="task-group">
            <h3 className="group-title">{groupName}</h3>
            <div className="task-list">
              {groupTasks.map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  isSelected={task.id === selectedTaskId}
                  onClick={onTaskSelect}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}