import React from 'react';
import { List, Card, Space, Button } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { useTasks } from '../../hooks/useTasks';
import { Task } from '../../models';
import { StatusBadge } from '../common/StatusBadge';
import { formatDate } from '../../utils/dateUtils';
import './RecentTasksList.css';

interface RecentTasksListProps {
  className?: string;
  limit?: number; // Количество отображаемых задач
}

const RecentTasksList: React.FC<RecentTasksListProps> = ({ className, limit = 5 }) => {
  const { tasks, loading, error, setSelectedTaskId } = useTasks();

  // Фильтрация и сортировка последних задач
  const recentTasks = React.useMemo(() => {
    return [...tasks]
      .sort((a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime())
      .slice(0, limit);
  }, [tasks, limit]);

  return (
    <Card
      title="Recent Tasks"
      className={`recent-tasks-list-container ${className || ''}`}
      bordered={false}
    >
      {error && <div className="recent-tasks-error">{error}</div>}
      {loading && <div className="recent-tasks-loading">Loading...</div>}
      {!loading && !error && (
        <List
          dataSource={recentTasks}
          renderItem={(task: Task) => (
            <List.Item
              className={new Date(task.endDate) < new Date() && task.status !== 'Completed' ? 'task-overdue' : ''}
              actions={[
                <Button
                  key="view"
                  type="link"
                  icon={<EyeOutlined />}
                  onClick={() => setSelectedTaskId(task.id)}
                >
                  View
                </Button>,
              ]}
            >
              <List.Item.Meta
                title={task.title}
                description={
                  <Space direction="vertical" size="small">
                    <span>Assignee: {task.assignee || 'Unassigned'}</span>
                    <span>Status: <StatusBadge status={task.status || 'Not Started'} /></span>
                    <span>Due: {formatDate(task.endDate)}</span>
                  </Space>
                }
              />
            </List.Item>
          )}
        />
      )}
    </Card>
  );
};

export default RecentTasksList;