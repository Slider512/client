import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ReactGrid, Column, Row, CellChange, Cell } from '@silevis/reactgrid';
import { Task, Dependency, DependencyType } from '../../models';
import { Toolbar }  from '../Toolbar/Toolbar';
import Sidebar  from '../Sidebar/Sidebar';
import { GanttChart} from '../GanttChart/GanttChart';
import { ProgressCellTemplate } from '../common/ProgressCell';
import { DateCellTemplate } from '../common/DateCell';
import { applyFilters, applyGrouping, applySorting } from '../../utils/dataUtils';
import { useTasks }  from '../../hooks/useTasks';
import  useDependencies  from '../../hooks/useDependencies';
import { exportToExcel, exportToPDF } from '../../api/exportApi';
import '../../styles/GanttContainer.css';

export const GanttContainer: React.FC = () => {
  // State management
  const { tasks, loading: tasksLoading, addTask, updateTask, deleteTask } = useTasks();
  const { dependencies, addDependency, removeDependency } = useDependencies();
  const [selectedTaskId, setSelectedTaskId] = useState<string|undefined>(undefined);
  const [groupBy, setGroupBy] = useState<string>('none');
  const [filters, setFilters] = useState({
    assignee: '',
    status: '',
    priority: '',
    searchText: ''
  });
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | undefined>(undefined);

  // Process data
  const processedTasks = useMemo(() => {
    let result = [...tasks];
    result = applyFilters(result, filters);
    result = applySorting(result, sortConfig);
    return result;
  }, [tasks, filters, sortConfig]);

  const groupedTasks = useMemo(() => {
    return applyGrouping(processedTasks, groupBy);
  }, [processedTasks, groupBy]);

  const selectedTask = useMemo(() => {
    return tasks.find(task => task.id === selectedTaskId) || null;
  }, [tasks, selectedTaskId]);

  // Handlers
  const handleTaskChange = useCallback((changes: CellChange<Cell>[]) => {
    const updatedTasks = [...tasks];
    changes.forEach(change => {
      const taskIndex = updatedTasks.findIndex(t => t.id === change.rowId);
      if (taskIndex >= 0) {
        updatedTasks[taskIndex] = { ...updatedTasks[taskIndex], ...change.newCell };
      }
    });
    updateTask(updatedTasks.find(t => t.id === changes[0].rowId)!);
  }, [tasks, updateTask]);

  const handleAddDependency = useCallback(async (fromTaskId: string, toTaskId: string, type: DependencyType) => {
    const result = await addDependency({ fromTaskId, toTaskId, type });
    if (result.success) {
      return true;
    }
    return false;
  }, [addDependency]);

  const handleExportExcel = useCallback(() => {
    exportToExcel(processedTasks, dependencies, `tasks_export_${new Date().toISOString().slice(0,10)}.xlsx`);
  }, [processedTasks, dependencies]);

  const handleExportPDF = useCallback(() => {
    exportToPDF(processedTasks, dependencies, `tasks_export_${new Date().toISOString().slice(0,10)}.pdf`);
  }, [processedTasks, dependencies]);

  // Columns configuration
  const columns = useMemo<Column[]>(() => [
    { columnId: 'title', width: 250, resizable: true },
    { columnId: 'assignee', width: 150 },
    { columnId: 'startDate', width: 120, template: DateCellTemplate },
    { columnId: 'endDate', width: 120, template: DateCellTemplate },
    { columnId: 'status', width: 120 },
    { columnId: 'priority', width: 100 },
    { columnId: 'progress', width: 150, template: ProgressCellTemplate }
  ], []);

  // Rows generation
  const getRows = useCallback((): Row<Cell>[] => {
    const headerRow: Row = {
      rowId: 'header',
      cells: columns.map(col => ({
        type: 'header',
        text: col.columnId.toString().charAt(0).toUpperCase() + col.columnId.toString().slice(1)
      }))
    };

    const taskRows: Row<Cell>[] = processedTasks.map(task => ({
      rowId: task.id,
      cells: [
        { type: 'text', text: task.title },
        { type: 'text', text: task.assignee || '' },
        { type: 'date', date: new Date(task.startDate), format: 'dd MMM yyyy' },
        { type: 'date', date: new Date(task.endDate), format: 'dd MMM yyyy' },
        { type: 'text', text: task.status || 'Not Started' },
        { type: 'text', text: task.priority || '' },
        { type: 'progress', value: task.progress }
      ]
    }));

    return [headerRow, ...taskRows];
  }, [columns, processedTasks]);

  if (tasksLoading) {
    return <div className="loading-container">Loading tasks...</div>;
  }

  return (
    <div className="gantt-container">
      <Toolbar
        tasksCount={tasks?.length}
        groupBy={groupBy}
        onGroupChange={setGroupBy}
        filters={filters}
        onFilterChange={setFilters}
        sortConfig={sortConfig}
        onSortChange={setSortConfig}
        //onExportExcel={handleExportExcel}
        //onExportPDF={handleExportPDF}
        onAddTask={() => addTask({
          title: 'New Task',
          //type: 'text',
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 86400000).toISOString(),
          progress: 0,
          status: 'Not Started',
          createdAt: new Date(Date.now()).toISOString()
        })}
      />

      <div className="gantt-content">
        <Sidebar
          tasks={groupedTasks}
          selectedTaskId={selectedTaskId}
          onTaskSelect={(task:Task)=>setSelectedTaskId(task.id)}
        />

        <div className="gantt-chart-area">
          <ReactGrid
            rows={getRows()}
            columns={columns}
            onCellsChanged={handleTaskChange}
            enableRangeSelection
            enableRowSelection
            stickyTopRows={1}
            customCellTemplates={{
              progress: ProgressCellTemplate,
              date: DateCellTemplate
            }}
          />

          <GanttChart
            tasks={processedTasks}
            dependencies={dependencies}
            selectedTaskId={selectedTaskId}
            onTaskSelect={setSelectedTaskId}
            onAddDependency={handleAddDependency}
            onDeleteDependency={removeDependency}
          />
        </div>
      </div>
    </div>
  );
};