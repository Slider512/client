import React, { useMemo } from 'react';
import { Card, Select } from 'antd';
import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import { TooltipComponent, LegendComponent, GridComponent } from 'echarts/components';
import ReactECharts from 'echarts-for-react';
import { useTasks } from '../../hooks/useTasks';
import { Task } from '../../models';
import { formatDate } from '../../utils/dateUtils';
import './TaskActivityChart.css';

// Регистрация компонентов ECharts
echarts.use([LineChart, CanvasRenderer, TooltipComponent, LegendComponent, GridComponent]);

interface TaskActivityChartProps {
  className?: string;
}

const TaskActivityChart: React.FC<TaskActivityChartProps> = ({ className }) => {
  const { tasks, loading, error } = useTasks();
  const [timeRange, setTimeRange] = React.useState<'week' | 'month' | 'year'>('week');

  // Подсчет активности задач по дням
  const activityData = useMemo(() => {
    const days: { [key: string]: { created: number; completed: number } } = {};
    const now = new Date();
    let startDate: Date;

    // Определяем временной диапазон
    if (timeRange === 'week') {
      startDate = new Date(now.setDate(now.getDate() - 7));
    } else if (timeRange === 'month') {
      startDate = new Date(now.setMonth(now.getMonth() - 1));
    } else {
      startDate = new Date(now.setFullYear(now.getFullYear() - 1));
    }

    // Инициализация дней
    const currentDate = new Date(startDate);
    while (currentDate <= new Date()) {
      const dateKey = formatDate(currentDate.toISOString());
      days[dateKey] = { created: 0, completed: 0 };
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Подсчет созданных и завершенных задач
    tasks.forEach((task: Task) => {
      const createdDate = formatDate(task.createdAt);
      const completedDate = task.status === 'Completed' && task.updatedAt ? formatDate(task.updatedAt) : null;

      if (createdDate in days) {
        days[createdDate].created += 1;
      }
      if (completedDate && completedDate in days) {
        days[completedDate].completed += 1;
      }
    });

    // Формирование данных для графика
    const dates = Object.keys(days).sort();
    const createdData = dates.map((date) => days[date].created);
    const completedData = dates.map((date) => days[date].completed);

    return { dates, createdData, completedData };
  }, [tasks, timeRange]);

  // Конфигурация диаграммы ECharts
  const option = useMemo(
    () => ({
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          const date = params[0].name;
          let result = `${date}<br/>`;
          params.forEach((item: any) => {
            result += `${item.seriesName}: ${item.value}<br/>`;
          });
          return result;
        },
      },
      legend: {
        data: ['Created', 'Completed'],
        bottom: 0,
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '10%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: activityData.dates,
      },
      yAxis: {
        type: 'value',
        minInterval: 1,
      },
      series: [
        {
          name: 'Created',
          type: 'line',
          stack: 'Total',
          data: activityData.createdData,
          color: '#1890ff',
          smooth: true,
        },
        {
          name: 'Completed',
          type: 'line',
          stack: 'Total',
          data: activityData.completedData,
          color: '#52c41a',
          smooth: true,
        },
      ],
    }),
    [activityData]
  );

  return (
    <Card
      title="Task Activity"
      className={`task-activity-chart-container ${className || ''}`}
      bordered={false}
      extra={
        <Select
          defaultValue="week"
          onChange={(value: 'week' | 'month' | 'year') => setTimeRange(value)}
          style={{ width: 120 }}
        >
          <Select.Option value="week">Last Week</Select.Option>
          <Select.Option value="month">Last Month</Select.Option>
          <Select.Option value="year">Last Year</Select.Option>
        </Select>
      }
    >
      {error && <div className="task-activity-chart-error">{error}</div>}
      {loading && <div className="task-activity-chart-loading">Loading...</div>}
      {!loading && !error && (
        <ReactECharts
          echarts={echarts}
          option={option}
          style={{ height: 350, width: '100%' }}
          className="task-activity-chart"
        />
      )}
    </Card>
  );
};

export default TaskActivityChart;