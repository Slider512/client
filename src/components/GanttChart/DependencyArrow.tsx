import React, { useState } from 'react';
import { Tooltip, Popconfirm } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { DependencyType } from '../../models';
import '../../styles/DependencyArrow.css';

interface DependencyArrowProps {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  type: DependencyType;
  onDelete?: () => void;
  onClick?: () => void;
  selected?: boolean;
}

export const DependencyArrow: React.FC<DependencyArrowProps> = ({
  fromX,
  fromY,
  toX,
  toY,
  type,
  onDelete,
  onClick,
  selected = false
}) => {
  const [hovered, setHovered] = useState(false);
  const showControls = hovered || selected;

  // Рассчитываем угол для стрелки
  const angle = Math.atan2(toY - fromY, toX - fromX) * 180 / Math.PI;

  // Рассчитываем длину линии
  const length = Math.sqrt(Math.pow(toX - fromX, 2) + Math.pow(toY - fromY, 2));

  // Позиционируем удаление посередине стрелки
  const controlX = fromX + (toX - fromX) / 2;
  const controlY = fromY + (toY - fromY) / 2;

  // Цвета в зависимости от типа зависимости
  const getArrowColor = () => {
    if (selected) return '#1890ff';
    if (hovered) return '#13c2c2';
    return '#666';
  };

  const arrowColor = getArrowColor();

  // Иконки для разных типов зависимостей
  const typeIcons = {
    'FS': '→', // Finish-to-Start
    'FF': '⇥', // Finish-to-Finish
    'SS': '⇤', // Start-to-Start
    'SF': '←'  // Start-to-Finish
  };

  return (
    <g 
      className="dependency-arrow-container"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      {/* Основная линия зависимости */}
      <line
        x1={fromX}
        y1={fromY}
        x2={toX}
        y2={toY}
        stroke={arrowColor}
        strokeWidth={selected ? 3 : 2}
        strokeDasharray={type === 'SF' ? '5,3' : 'none'}
        markerEnd={`url(#arrowhead-${arrowColor.replace('#', '')})`}
        className="dependency-line"
      />

      {/* Маркер типа зависимости */}
      <Tooltip title={getDependencyLabel(type)}>
        <text
          x={fromX + (toX - fromX) * 0.3}
          y={fromY + (toY - fromY) * 0.3 - 8}
          fill={arrowColor}
          fontSize="12"
          fontWeight="bold"
          textAnchor="middle"
          className="dependency-type-marker"
        >
          {typeIcons[type]}
        </text>
      </Tooltip>

      {/* Кнопка удаления */}
      {showControls && onDelete && (
        <Popconfirm
          title="Delete this dependency?"
          onConfirm={onDelete}
          okText="Yes"
          cancelText="No"
          placement="top"
        >
          <g 
            className="dependency-control"
            transform={`translate(${controlX}, ${controlY})`}
          >
            <circle
              cx="0"
              cy="0"
              r="12"
              fill="#fff"
              stroke="#f5222d"
              strokeWidth="1.5"
            />
            <DeleteOutlined 
              style={{ 
                fontSize: 12,
                color: '#f5222d',
                transform: 'translate(-6px, -6px)' 
              }} 
            />
          </g>
        </Popconfirm>
      )}

      {/* Определение маркера стрелки */}
      <defs>
        <marker
          id={`arrowhead-${arrowColor.replace('#', '')}`}
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon 
            points="0 0, 10 3.5, 0 7" 
            fill={arrowColor}
          />
        </marker>
      </defs>
    </g>
  );
};

// Вспомогательная функция для получения текстового описания типа зависимости
function getDependencyLabel(type: DependencyType): string {
  switch (type) {
    case 'FS': return 'Finish-to-Start: Task B cannot start until Task A finishes';
    case 'FF': return 'Finish-to-Finish: Task B cannot finish until Task A finishes';
    case 'SS': return 'Start-to-Start: Task B cannot start until Task A starts';
    case 'SF': return 'Start-to-Finish: Task B cannot finish until Task A starts';
    default: return 'Dependency';
  }
}