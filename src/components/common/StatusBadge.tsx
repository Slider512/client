import React from 'react';
import { Tooltip } from 'antd';
import '../../styles/StatusBadge.css';

// Типы статусов и их цветов
export type StatusType = 
  | 'Not Started'
  | 'In Progress'
  | 'Completed'
  | 'On Hold'
  | 'Cancelled'
  | 'Pending Review'
  | 'Approved'
  | 'Rejected'
  | 'High Priority'
  | 'Medium Priority'
  | 'Low Priority'
  | string;

interface StatusBadgeProps {
  status: StatusType;
  size?: 'small' | 'medium' | 'large';
  className?: string;
  style?: React.CSSProperties;
  tooltip?: string;
  showText?: boolean;
}

// Цвета для различных статусов
const STATUS_COLORS: Record<string, string> = {
  'Not Started': '#8c8c8c',      // серый
  'In Progress': '#1890ff',      // синий
  'Completed': '#52c41a',        // зеленый
  'On Hold': '#faad14',          // желтый/оранжевый
  'Cancelled': '#f5222d',        // красный
  'Pending Review': '#722ed1',   // фиолетовый
  'Approved': '#13c2c2',         // бирюзовый
  'Rejected': '#ff4d4f',         // красный (более яркий)
  'High Priority': '#f5222d',    // красный
  'Medium Priority': '#fa8c16',  // оранжевый
  'Low Priority': '#52c41a'      // зеленый
};

// Размеры для разных вариантов
const SIZE_STYLES = {
  small: {
    fontSize: '10px',
    padding: '2px 6px',
    minWidth: '50px'
  },
  medium: {
    fontSize: '12px',
    padding: '4px 8px',
    minWidth: '70px'
  },
  large: {
    fontSize: '14px',
    padding: '6px 12px',
    minWidth: '90px'
  }
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'medium',
  className = '',
  style = {},
  tooltip,
  showText = true
}) => {
  // Определяем цвет статуса
  const statusColor = STATUS_COLORS[status] || '#d9d9d9';
  
  // Рассчитываем контрастный цвет текста
  const textColor = getContrastColor(statusColor);

  // Форматируем текст статуса
  const formattedStatus = formatStatusText(status);

  // Комбинируем стили
  const badgeStyle = {
    ...SIZE_STYLES[size],
    backgroundColor: statusColor,
    color: textColor,
    ...style
  };

  // Рендерим бейдж с или без тултипа
  const badgeContent = (
    <span 
      className={`status-badge ${className}`}
      style={badgeStyle}
    >
      {showText && formattedStatus}
    </span>
  );

  return tooltip ? (
    <Tooltip title={tooltip}>
      {badgeContent}
    </Tooltip>
  ) : (
    badgeContent
  );
};

// Функция для определения контрастного цвета текста
function getContrastColor(hexColor: string): string {
  // Удаляем # если есть
  const hex = hexColor.replace('#', '');
  
  // Конвертируем HEX в RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Рассчитываем яркость по формуле YIQ
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  
  // Возвращаем черный или белый в зависимости от яркости фона
  return yiq >= 128 ? '#000000' : '#FFFFFF';
}

// Форматирование текста статуса
function formatStatusText(status: string): string {
  // Убираем слово "Priority" если есть
  if (status.includes('Priority')) {
    return status.replace(' Priority', '');
  }
  return status;
}