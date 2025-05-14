import React, { useMemo } from 'react';
import { Card } from 'antd';
import * as echarts from 'echarts/core';
import { PieChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import { TooltipComponent, LegendComponent } from 'echarts/components';
import ReactECharts from 'echarts-for-react';
import { useTasks } from '../../hooks/useTasks';
import { Task } from '../../models';
import './TaskStatusPie.css';

// Регистрация компонентов ECharts
echarts.use([PieChart, CanvasRenderer, TooltipComponent, LegendComponent]);

interface TaskStatusPieProps {
  className?: string;
}

const TaskStatusPie: React.FC<TaskStatusPieProps> = ({ className }) => {
  const { tasks, loading, error } = useTasks();

  // Подсчет задач по статусам
  const statusData = useMemo(() => {
    const statusCounts = tasks.reduce(
      (acc:any, task: Task) => {
        const status = task.status || 'Not Started';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return Object.entries(statusCounts).map(([name, value]) => ({
      name,
      value,
    }));
  }, [tasks]);

  // Конфигурация диаграммы ECharts
  const option = useMemo(
    () => ({
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)',
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        textStyle: {
          fontSize: 12,
        },
      },
      series: [
        {
          name: 'Task Status',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          label: {
            show: false,
            position: 'center',
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 16,
              fontWeight: 'bold',
            },
          },
          labelLine: {
            show: false,
          },
          data: statusData,
          color: ['#1890ff', '#13c2c2', '#52c41a', '#fadb14', '#f5222d'], // Цвета для статусов
        },
      ],
    }),
    [statusData]
  );

  return (
    <Card
      title="Task Status Distribution"
      className={`task-status-pie-container ${className || ''}`}
      bordered={false}
    >
      {error && <div className="task-status-pie-error">{error}</div>}
      {loading && <div className="task-status-pie-loading">Loading...</div>}
      {!loading && !error && (
        <ReactECharts
          echarts={echarts}
          option={option}
          style={{ height: 300, width: '100%' }}
          className="task-status-pie-chart"
        />
      )}
    </Card>
  );
};

export default TaskStatusPie;