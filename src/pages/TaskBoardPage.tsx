import React from 'react';
import { Button, Tabs, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import {GanttContainer} from '../components/gantt/GanttContainer';
import TaskList from '../components/tasks/TaskList';
import { useAuth } from '../auth/AuthContext';
import './TaskBoardPage.css';

const { Title } = Typography;
const { TabPane } = Tabs;

const TaskBoardPage: React.FC = () => {
  const { login } = useAuth();

  return (
    <div className="task-board-page">
      <div className="page-header">
        <Title level={2}>Task Board</Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={() => console.log('Add new task')}
        >
          Add Task
        </Button>
      </div>

      <Tabs defaultActiveKey="gantt">
        <TabPane tab="Gantt Chart" key="gantt">
          <div className="gantt-container-wrapper">
            <GanttContainer />
          </div>
        </TabPane>
        <TabPane tab="List View" key="list">
          <TaskList />
        </TabPane>
        <TabPane tab="Board View" key="board">
          <div className="scrum-board-wrapper">
            {/* Здесь будет компонент Scrum доски */}
            <p>Scrum board coming soon</p>
          </div>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default TaskBoardPage;