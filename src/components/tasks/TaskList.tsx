import React, { useState, useMemo } from 'react';
import { Table, Button, Popconfirm, Input, Select, Space } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useTasks } from '../../hooks/useTasks';
import { Task } from '../../models';
import { StatusBadge } from '../common/StatusBadge';
import { formatDate } from '../../utils/dateUtils';
import './TaskList.css';

const { Option } = Select;
const { Search } = Input;

interface TaskListProps {
  className?: string;
}

const TaskList: React.FC<TaskListProps> = ({ className }) => {
  const { tasks, loading, error, deleteTask, setSelectedTaskId, getTasksByStatus, getTasksByAssignee } = useTasks();
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | undefined>(undefined);
  const [filterAssignee, setFilterAssignee] = useState<string | undefined>(undefined);
  const [sortField, setSortField] = useState<string | undefined>(undefined);
  const [sortOrder, setSortOrder] = useState<'ascend' | 'descend' | undefined>(undefined);
  const [groupBy, setGroupBy] = useState<'none' | 'status' | 'assignee'>('none');

  // Фильтрация и сортировка задач
  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    // Поиск по названию
    if (searchText) {
      result = result.filter(task =>
        task.title.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Фильтрация по статусу
    if (filterStatus) {
      result = getTasksByStatus(filterStatus);
    }

    // Фильтрация по исполнителю
    if (filterAssignee) {
      result = getTasksByAssignee(filterAssignee);
    }

    // Сортировка
    if (sortField) {
      result.sort((a, b) => {
        const order = sortOrder === 'descend' ? -1 : 1;
        switch (sortField) {
          case 'title':
            return a.title.localeCompare(b.title) * order;
          case 'startDate':
            return (new Date(a.startDate).getTime() - new Date(b.startDate).getTime()) * order;
          case 'endDate':
            return (new Date(a.endDate).getTime() - new Date(b.endDate).getTime()) * order;
          case 'progress':
            return (a.progress - b.progress) * order;
          default:
            return 0;
        }
      });
    }

    return result;
  }, [tasks, searchText, filterStatus, filterAssignee, sortField, sortOrder, getTasksByStatus, getTasksByAssignee]);

  // Группировка задач
  const groupedTasks = useMemo(() => {
    if (groupBy === 'none') {
      return [{ key: 'all', title: '', tasks: filteredTasks }];
    }

    const groups: { key: string; title: string; tasks: Task[] }[] = [];
    const groupedData = groupBy === 'status'
      ? filteredTasks.reduce((acc, task) => {
          const key = task.status || 'Not Started';
          acc[key] = acc[key] || [];
          acc[key].push(task);
          return acc;
        }, {} as Record<string, Task[]>)
      : filteredTasks.reduce((acc, task) => {
          const key = task.assignee || 'Unassigned';
          acc[key] = acc[key] || [];
          acc[key].push(task);
          return acc;
        }, {} as Record<string, Task[]>);

    Object.keys(groupedData).forEach(key => {
      groups.push({
        key,
        title: key,
        tasks: groupedData[key]
      });
    });

    return groups.sort((a, b) => a.title.localeCompare(b.title));
  }, [filteredTasks, groupBy]);

  // Колонки таблицы
  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      sorter: true,
      width: 200,
    },
    {
      title: 'Assignee',
      dataIndex: 'assignee',
      sorter: true,
      width: 150,
      render: (assignee: string) => assignee || 'Unassigned',
    },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      sorter: true,
      width: 120,
      render: (date: string) => formatDate(date),
    },
    {
      title: 'End Date',
      dataIndex: 'endDate',
      sorter: true,
      width: 120,
      render: (date: string) => formatDate(date),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      sorter: true,
      width: 150,
      render: (status: string) => <StatusBadge status={status || 'Not Started'} />,
    },
    {
      title: 'Progress',
      dataIndex: 'progress',
      sorter: true,
      width: 100,
      render: (progress: number) => `${progress}%`,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_: any, record: Task) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => setSelectedTaskId(record.id)}
            size="small"
          />
          <Popconfirm
            title="Are you sure to delete this task?"
            onConfirm={() => deleteTask(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<DeleteOutlined />} size="small" danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Обработчик сортировки
  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    setSortField(sorter.field);
    setSortOrder(sorter.order);
  };

  // Получение уникальных исполнителей и статусов
  const assignees = [...new Set(tasks.map(task => task.assignee).filter(Boolean))] as string[];
  const statuses = [...new Set(tasks.map(task => task.status || 'Not Started'))];

  return (
    <div className={`task-list-container ${className || ''}`}>
      {/* Фильтры и поиск */}
      <div className="task-list-controls">
        <Space direction="horizontal" size="middle" style={{ marginBottom: 16 }}>
          <Search
            placeholder="Search tasks"
            onSearch={value => setSearchText(value)}
            onChange={e => setSearchText(e.target.value)}
            style={{ width: 200 }}
          />
          <Select
            placeholder="Filter by status"
            onChange={(value: string | undefined) => setFilterStatus(value)}
            allowClear
            style={{ width: 150 }}
          >
            {statuses.map(status => (
              <Option key={status} value={status}>
                {status}
              </Option>
            ))}
          </Select>
          <Select
            placeholder="Filter by assignee"
            onChange={(value: string | undefined) => setFilterAssignee(value)}
            allowClear
            style={{ width: 150 }}
          >
            {assignees.map(assignee => (
              <Option key={assignee} value={assignee}>
                {assignee}
              </Option>
            ))}
          </Select>
          <Select
            placeholder="Group by"
            onChange={(value: 'none' | 'status' | 'assignee') => setGroupBy(value)}
            defaultValue="none"
            style={{ width: 150 }}
          >
            <Option value="none">None</Option>
            <Option value="status">Status</Option>
            <Option value="assignee">Assignee</Option>
          </Select>
        </Space>
      </div>

      {/* Ошибка или загрузка */}
      {error && <div className="task-list-error">{error}</div>}
      {loading && <div className="task-list-loading">Loading...</div>}

      {/* Список задач */}
      {!loading && !error && (
        <div className="task-list-content">
          {groupedTasks.map(group => (
            <div key={group.key} className="task-group">
              {groupBy !== 'none' && (
                <h3 className="task-group-title">{group.title || 'No Group'}</h3>
              )}
              <Table
                columns={columns}
                dataSource={group.tasks}
                rowKey="id"
                onChange={handleTableChange}
                pagination={{ pageSize: 10 }}
                loading={loading}
                rowClassName={(record) =>
                  new Date(record.endDate) < new Date() && record.status !== 'Completed'
                    ? 'task-overdue'
                    : ''
                }
                onRow={(record) => ({
                  onClick: () => setSelectedTaskId(record.id),
                })}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;