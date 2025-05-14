import { Column, Row } from '@silevis/reactgrid';
import { Task } from '../models';

export const getColumns = (): Column[] => [
  { columnId: 'title', width: 200, resizable: true },
  { columnId: 'assignee', width: 150 },
  { columnId: 'startDate', width: 120 },
  { columnId: 'endDate', width: 120 },
  { columnId: 'status', width: 150 },
  { columnId: 'progress', width: 150 }
];

export const getRows = (tasks: Task[]): Row[] => {
  const headerRow: Row = {
    rowId: 'header',
    cells: [
      { type: 'header', text: 'Task Name' },
      { type: 'header', text: 'Assignee' },
      { type: 'header', text: 'Start Date' },
      { type: 'header', text: 'End Date' },
      { type: 'header', text: 'Status' },
      { type: 'header', text: 'Progress' }
    ]
  };

  const taskRows: Row[] = tasks.map(task => ({
    rowId: task.id,
    cells: [
      { type: 'text', text: task.title },
      { type: 'text', text: task.assignee || '' },
      { type: 'date', date: new Date(task.startDate) },
      { type: 'date', date: new Date(task.endDate) },
      { type: 'text', text: task.status || 'Not Started' },
      { type: 'number', value: task.progress }
    ]
  }));

  return [headerRow, ...taskRows];
};

export const calculateBarDuration = (start: Date, end: Date): number => {
  return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
};