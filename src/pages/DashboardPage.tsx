import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Typography } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { useTasks } from '../hooks/useTasks';
import { useAuth } from '../auth/AuthContext';
import ProjectSelector from '../components/ProjectSelector';
import TaskActivityChart from '../components/dashboard/TaskActivityChart';
import TaskStatusPie from '../components/dashboard/TaskStatusPie';
import RecentTasksList from '../components/dashboard/RecentTasksList';
import './DashboardPage.css';
import { fetchTasks } from '../api/taskApi';
import { message } from 'antd';

const { Title } = Typography;

const DashboardPage: React.FC = () => {
  const { tasks, loading, error, fetchTasksByProject } = useTasks();
  const { login } = useAuth();
  const [selectedProjectId, setSelectedProjectId] = useState<string | undefined>(undefined);
  // Статистика
  const completedTasks = tasks.filter(t => t.status === 'Completed').length;
  const inProgressTasks = tasks.filter(t => t.status === 'In Progress').length;
  const overdueTasks = tasks.filter(t => 
    t.status !== 'Completed' && 
    new Date(t.endDate) < new Date()
  ).length;

  // Загрузка задач при изменении проекта
  React.useEffect(() => {
    fetchTasksByProject(selectedProjectId);
  }, [selectedProjectId, fetchTasksByProject]);

  return (
    <div className="dashboard-page">
      <Title level={2}>Dashboard</Title>
      <p>Welcome back, {login?.name}!</p>

      <ProjectSelector
        selectedProjectId={selectedProjectId}
        onSelectProject={setSelectedProjectId}
      />

      {/* Статистика */}
      <Row gutter={[16, 16]} className="stats-row">
        <Col span={8}>
          <Card>
            <Statistic
              title="Total Tasks"
              value={tasks.length}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Completed"
              value={completedTasks}
              valueStyle={{ color: '#52c41a' }}
              prefix={<ArrowUpOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Overdue"
              value={overdueTasks}
              valueStyle={{ color: '#f5222d' }}
              prefix={<ArrowDownOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Графики */}
      <Row gutter={[16, 16]} className="charts-row">
        <Col span={16}>
          <Card title="Task Activity">
            <TaskActivityChart /*tasks={tasks}*/ />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Task Status">
            <TaskStatusPie /*tasks={tasks}*/ />
          </Card>
        </Col>
      </Row>

      {/* Последние задачи */}
      <Row className="recent-tasks-row">
        <Col span={24}>
          <Card title="Recent Tasks">
            <RecentTasksList /*tasks={tasks.slice(0, 5)}*/ />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;