import React, { useMemo } from 'react';
import { format, addDays, isWeekend, isSameMonth } from 'date-fns';
import '../../styles/TimelineHeader.css';

interface TimelineHeaderProps {
  startDate: Date;
  endDate: Date;
  dayWidth: number;
  scale: number;
  onScaleChange?: (scale: number) => void;
  showZoomControls?: boolean;
}

export const TimelineHeader: React.FC<TimelineHeaderProps> = ({
  startDate,
  endDate,
  dayWidth,
  scale,
  onScaleChange,
  showZoomControls = true
}) => {
  // Генерация диапазона дат
  const dates = useMemo(() => {
    const days = [];
    let currentDate = new Date(startDate);
    const end = new Date(endDate);
    
    while (currentDate <= end) {
      days.push(new Date(currentDate));
      currentDate = addDays(currentDate, 1);
    }
    
    return days;
  }, [startDate, endDate]);

  // Группировка по месяцам
  const monthRanges = useMemo(() => {
    if (dates.length === 0) return [];
    
    const ranges: { month: string; startIndex: number; endIndex: number }[] = [];
    let currentMonth = format(dates[0], 'yyyy-MM');
    let startIndex = 0;
    
    dates.forEach((date, index) => {
      const month = format(date, 'yyyy-MM');
      if (month !== currentMonth) {
        ranges.push({
          month: currentMonth,
          startIndex,
          endIndex: index - 1
        });
        currentMonth = month;
        startIndex = index;
      }
    });
    
    // Добавляем последний месяц
    ranges.push({
      month: currentMonth,
      startIndex,
      endIndex: dates.length - 1
    });
    
    return ranges;
  }, [dates]);

  // Обработчики масштабирования
  const handleZoomIn = () => {
    if (onScaleChange) {
      onScaleChange(Math.min(2, scale + 0.1));
    }
  };

  const handleZoomOut = () => {
    if (onScaleChange) {
      onScaleChange(Math.max(0.5, scale - 0.1));
    }
  };

  const handleZoomReset = () => {
    if (onScaleChange) {
      onScaleChange(1);
    }
  };

  return (
    <div className="timeline-header-container">
      {showZoomControls && (
        <div className="zoom-controls">
          <button onClick={handleZoomOut} title="Zoom Out">-</button>
          <span>{Math.round(scale * 100)}%</span>
          <button onClick={handleZoomIn} title="Zoom In">+</button>
          <button onClick={handleZoomReset} title="Reset Zoom">↻</button>
        </div>
      )}

      <div className="timeline-header">
        {/* Месяцы */}
        <div className="timeline-months">
          {monthRanges.map((range, index) => (
            <div
              key={range.month}
              className="timeline-month"
              style={{
                width: `${(range.endIndex - range.startIndex + 1) * dayWidth}px`,
                left: `${range.startIndex * dayWidth}px`
              }}
            >
              {format(new Date(range.month + '-01'), 'MMMM yyyy')}
            </div>
          ))}
        </div>

        {/* Дни недели */}
        <div className="timeline-weekdays">
          {dates.map((date, index) => {
            const isWeekendDay = isWeekend(date);
            const isFirstOfMonth = isSameMonth(date, addDays(date, -1)) === false;
            
            return (
              <div
                key={date.toString()}
                className={`timeline-weekday ${isWeekendDay ? 'weekend' : ''} ${isFirstOfMonth ? 'first-of-month' : ''}`}
                style={{ width: `${dayWidth}px` }}
              >
                {format(date, 'EEE')}
              </div>
            );
          })}
        </div>

        {/* Дни */}
        <div className="timeline-days">
          {dates.map((date, index) => {
            const isWeekendDay = isWeekend(date);
            const isFirstOfMonth = isSameMonth(date, addDays(date, -1)) === false;
            
            return (
              <div
                key={date.toString()}
                className={`timeline-day ${isWeekendDay ? 'weekend' : ''} ${isFirstOfMonth ? 'first-of-month' : ''}`}
                style={{ width: `${dayWidth}px` }}
              >
                <div className="day-number">
                  {format(date, 'd')}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};