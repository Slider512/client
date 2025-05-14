import React from 'react';
import { CellTemplate, Cell } from '@silevis/reactgrid';
import { format } from 'date-fns';

export interface DateCell extends Cell {
  type: 'date';
  date: Date;
  format: string;
  text:string;
  value:number;
}

export const DateCellTemplate: CellTemplate<DateCell> = {
  getCompatibleCell(initialCell): DateCell {
    let date: Date;
    if (initialCell.date instanceof Date) {
      date = initialCell.date;
    } else if (typeof initialCell.date === 'string') {
      date = new Date(initialCell.date);
    } else {
      date = new Date();
    }
    return {
      ...initialCell,
      type: 'date',
      date,
      format: initialCell.format || 'yyyy-MM-dd',
      text:"",
      value:0,
    };
  },
  render(cell: DateCell): React.ReactNode {
    return (
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        padding: '0 8px',
        fontSize: '13px'
      }}>
        {format(cell.date, cell.format)}
      </div>
    );
  },
  isFocusable(cell: DateCell): boolean{
    return true;
  }
};