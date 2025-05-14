import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Task, Dependency, DependencyType } from '../../models';
import { DependencyArrow } from './DependencyArrow';
import { TaskBar } from './TaskBar';
import { TimelineHeader } from './TimelineHeader';
import { AddDependencyModal } from './AddDependencyModal';
import { calculateDuration, formatDate } from '../../utils/dateUtils';
import { useDrag, useDrop, DropTargetMonitor } from 'react-dnd';
import './GanttChart.css';

interface GanttChartProps {
  tasks: Task[];
  dependencies: Dependency[];
  selectedTaskId: string | undefined;
  onTaskSelect: (taskId: string) => void;
  onAddDependency: (fromTaskId: string, toTaskId: string, type: DependencyType) => Promise<boolean>;
  onDeleteDependency: (dependencyId: string) => void;
}

export const GanttChart: React.FC<GanttChartProps> = ({
  tasks,
  dependencies,
  selectedTaskId,
  onTaskSelect,
  onAddDependency,
  onDeleteDependency
}) => {
  const ganttRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number>(1);
  const [startDate, setStartDate] = useState<Date>(() => {
    const minDate = tasks.reduce((min, task) => {
      const taskDate = new Date(task.startDate);
      return taskDate < min ? taskDate : min;
    }, new Date());
    return minDate;
  });
  const [endDate, setEndDate] = useState<Date>(() => {
    const maxDate = tasks.reduce((max, task) => {
      const taskDate = new Date(task.endDate);
      return taskDate > max ? taskDate : max;
    }, new Date());
    return maxDate;
  });
  const [dragOverTaskId, setDragOverTaskId] = useState<string | null>(null);
  const [dependencyModal, setDependencyModal] = useState<{
    visible: boolean;
    fromTaskId?: string;
    toTaskId?: string;
  }>({ visible: false });

  const daysCount = calculateDuration(startDate.toISOString(), endDate.toISOString());
  const dayWidth: number = 40 * scale;
  const rowHeight = 40;
  const ganttWidth = daysCount * dayWidth;

  const handleAddDependency = async (type: DependencyType) => {
    if (!dependencyModal.fromTaskId || !dependencyModal.toTaskId) return;
    const success = await onAddDependency(
      dependencyModal.fromTaskId,
      dependencyModal.toTaskId,
      type
    );
    if (success) {
      setDependencyModal({ visible: false });
    }
  };

  // Настройка drop с использованием useDrop
  const [{ isOver }, drop] = useDrop({
    accept: 'TASK',
    drop: (item: { id: string }, monitor: DropTargetMonitor) => {
      if (!dragOverTaskId) return;
      setDependencyModal({
        visible: true,
        fromTaskId: item.id,
        toTaskId: dragOverTaskId
      });
      setDragOverTaskId(null);
    },
    hover: (item, monitor) => {
      if (!ganttRef.current) return;
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;
      const hoveredElement = document.elementFromPoint(
        clientOffset.x,
        clientOffset.y
      )?.closest('.task-bar');
      if (hoveredElement) {
        setDragOverTaskId(hoveredElement.getAttribute('data-task-id'));
      } else {
        setDragOverTaskId(null);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  // Callback ref для передачи DOM-элемента в drop
  const dropRef = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      drop(node);
    }
  }, [drop]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();
        setScale(prev => Math.max(0.5, Math.min(2, prev + e.deltaY * -0.001)));
      }
    };

    const container = ganttRef.current;
    container?.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      container?.removeEventListener('wheel', handleWheel);
    };
  }, []);

  const calculateTaskPosition = (task: Task) => {
    const start = new Date(task.startDate);
    const end = new Date(task.endDate);
    const daysFromStart = calculateDuration(
      startDate.toISOString(),
      start.toISOString()
    );
    const duration = calculateDuration(
      task.startDate,
      task.endDate
    );

    return {
      left: daysFromStart * dayWidth,
      width: duration * dayWidth,
      top: tasks.findIndex(t => t.id === task.id) * rowHeight + 30,
      height: rowHeight - 8
    };
  };

  return (
    <div ref={ganttRef} className="gantt-chart-container">
      <div ref={dropRef} className="gantt-chart" style={{ width: `${ganttWidth}px` }}>
        <TimelineHeader
          startDate={startDate}
          endDate={endDate}
          dayWidth={dayWidth}
          scale={scale}
          onScaleChange={setScale}
        />
        <div className="tasks-container">
          {tasks.map(task => {
            const position = calculateTaskPosition(task);
            return (
              <TaskBar
                key={task.id}
                task={task}
                position={position}
                isSelected={task.id === selectedTaskId}
                onClick={() => onTaskSelect(task.id)}
                onDoubleClick={() => {
                  setDependencyModal({
                    visible: true,
                    fromTaskId: task.id
                  });
                }}
              />
            );
          })}
          {dependencies.map(dependency => {
            const fromTask = tasks.find(t => t.id === dependency.fromTaskId);
            const toTask = tasks.find(t => t.id === dependency.toTaskId);
            if (!fromTask || !toTask) return null;
            const fromPos = calculateTaskPosition(fromTask);
            const toPos = calculateTaskPosition(toTask);
            return (
              <DependencyArrow
                key={`${dependency.fromTaskId}-${dependency.toTaskId}`}
                fromX={fromPos.left + fromPos.width}
                fromY={fromPos.top + fromPos.height / 2}
                toX={toPos.left}
                toY={toPos.top + toPos.height / 2}
                type={dependency.type}
                onDelete={() => onDeleteDependency(dependency.id)}
              />
            );
          })}
        </div>
      </div>
      <AddDependencyModal
        visible={dependencyModal.visible}
        fromTask={tasks.find(t => t.id === dependencyModal.fromTaskId)}
        toTask={tasks.find(t => t.id === dependencyModal.toTaskId)}
        onCancel={() => setDependencyModal({ visible: false })}
        onCreate={handleAddDependency}
      />
    </div>
  );
};