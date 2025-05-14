import React from 'react';
import { CellTemplate, Cell } from '@silevis/reactgrid';

export interface ProgressCell extends Cell {
  type: 'progress';
  value: number;
  color?: string;
  text:string;
}

export const ProgressCellTemplate: CellTemplate<ProgressCell> = {
  getCompatibleCell(initialCell): ProgressCell {
    return {
      ...initialCell,
      type: 'progress',
      value: initialCell.value || 0,
      color: initialCell.color || '#4CAF50',
      text:''
    };
  },
  render(cell: ProgressCell): React.ReactNode {
    return (
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        padding: '0 8px'
      }}>
        <div style={{
          width: '100%',
          height: '60%',
          backgroundColor: '#e0e0e0',
          borderRadius: '4px',
          overflow: 'hidden'
        }}>
          <div
            style={{
              width: `${Math.min(100, Math.max(0, cell.value))}%`,
              height: '100%',
              backgroundColor: getProgressColor(cell.value, cell.color),
              transition: 'width 0.3s ease'
            }}
          />
        </div>
        <span style={{
          marginLeft: '8px',
          fontSize: '12px',
          minWidth: '30px',
          textAlign: 'right'
        }}>
          {cell.value}%
        </span>
      </div>
    );
  }
};

function getProgressColor(value: number, defaultColor?: string): string {
  if (defaultColor) return defaultColor;
  if (value > 90) return '#4CAF50'; // green
  if (value > 70) return '#8BC34A'; // light green
  if (value > 50) return '#FFC107'; // yellow
  if (value > 30) return '#FF9800'; // orange
  return '#F44336'; // red
}