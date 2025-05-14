import React from 'react';
import { Button, Dropdown, Menu } from 'antd';
import { DownloadOutlined, FileExcelOutlined, FilePdfOutlined } from '@ant-design/icons';
import { exportToExcel, exportToPDF } from '../../api/exportApi';
import { Task, Dependency } from '../../models';
import '../../styles/ExportButton.css';

interface ExportButtonProps {
  tasks: Task[];
  dependencies?: Dependency[];
  disabled?: boolean;
}

export const ExportButton: React.FC<ExportButtonProps> = ({
  tasks,
  dependencies = [],
  disabled = false
}) => {
  const handleExport = (type: 'excel' | 'pdf') => {
    const dateStr = new Date().toISOString().slice(0, 10);
    const fileName = `tasks_export_${dateStr}.${type}`;
    
    if (type === 'excel') {
      exportToExcel(tasks, dependencies, fileName);
    } else {
      exportToPDF(tasks, dependencies, fileName);
    }
  };

  const menu = (
    <Menu className="export-menu">
      <Menu.Item 
        key="excel" 
        icon={<FileExcelOutlined />}
        onClick={() => handleExport('excel')}
      >
        Export to Excel
      </Menu.Item>
      <Menu.Item 
        key="pdf" 
        icon={<FilePdfOutlined />}
        onClick={() => handleExport('pdf')}
      >
        Export to PDF
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown 
      overlay={menu} 
      trigger={['click']}
      disabled={disabled || tasks.length === 0}
    >
      <Button 
        type="primary" 
        icon={<DownloadOutlined />}
        className="export-button"
      >
        Export
      </Button>
    </Dropdown>
  );
};