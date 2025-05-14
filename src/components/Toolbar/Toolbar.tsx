import React, { useState } from 'react';
import { 
  Button, 
  Row, 
  Col, 
  Input, 
  Select, 
  Space,
  Divider,
  Dropdown,
  Menu
} from 'antd';
import { 
  PlusOutlined, 
  FilterOutlined, 
  SortAscendingOutlined,
  UngroupOutlined,
  GroupOutlined,
  DownOutlined
} from '@ant-design/icons';
import { FilterDropdown } from './FilterDropdown';
import { ExportButton } from './ExportButton';
import { GroupByOption } from '../../models';
import '../../styles/Toolbar.css';

const { Option } = Select;
const { Search } = Input;

interface ToolbarProps {
  onAddTask: () => void;
  onFilterChange: (filters: {
    assignee: string;
    status: string;
    priority: string;
    searchText: string;
  }) => void;
  onSortChange: (sortConfig: {
    key: string;
    direction: 'asc' | 'desc';
  }) => void;
  onGroupChange: (groupBy: string) => void;
  groupBy: string;
  filters: {
    assignee: string;
    status: string;
    priority: string;
    searchText: string;
  };
  sortConfig?: {
    key: string;
    direction: 'asc' | 'desc';
  };
  tasksCount: number;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  onAddTask,
  onFilterChange,
  onSortChange,
  onGroupChange,
  groupBy,
  filters,
  sortConfig,
  tasksCount
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const assignees = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Williams'];
  const statuses = ['Not Started', 'In Progress', 'Completed', 'On Hold'];
  const priorities = ['High', 'Medium', 'Low'];

  const sortFields = [
    { key: 'title', label: 'Title' },
    { key: 'startDate', label: 'Start Date' },
    { key: 'endDate', label: 'End Date' },
    { key: 'priority', label: 'Priority' },
    { key: 'status', label: 'Status' }
  ];

  const groupOptions: { value: GroupByOption; label: string; icon: React.ReactNode }[] = [
    { value: 'none', label: 'No Grouping', icon: <UngroupOutlined /> },
    { value: 'status', label: 'By Status', icon: <GroupOutlined /> },
    { value: 'assignee', label: 'By Assignee', icon: <GroupOutlined /> },
    { value: 'priority', label: 'By Priority', icon: <GroupOutlined /> }
  ];

  const handleSearch = (value: string) => {
    onFilterChange({ ...filters, searchText: value });
  };

  const handleSortChange = (key: string) => {
    const direction = sortConfig?.key === key && sortConfig.direction === 'asc' 
      ? 'desc' 
      : 'asc';
    onSortChange({ key, direction });
  };

  const sortMenu = (
    <Menu className="sort-menu">
      {sortFields.map(field => (
        <Menu.Item 
          key={field.key}
          onClick={() => handleSortChange(field.key)}
          className={sortConfig?.key === field.key ? 'selected' : ''}
        >
          {field.label}
          {sortConfig?.key === field.key && (
            <span style={{ marginLeft: 8 }}>
              {sortConfig.direction === 'asc' ? '↑' : '↓'}
            </span>
          )}
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <div className="toolbar-container">
      <Row gutter={[16, 16]} align="middle">
        <Col flex="auto">
          <Space size="middle">
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={onAddTask}
            >
              Add Task
            </Button>

            <Search
              placeholder="Search tasks..."
              allowClear
              enterButton
              onSearch={handleSearch}
              style={{ width: 250 }}
            />

            <Button 
              icon={<FilterOutlined />}
              onClick={() => setShowFilters(!showFilters)}
              type={showFilters ? 'primary' : 'default'}
            >
              Filters
            </Button>

            <Dropdown overlay={sortMenu} trigger={['click']}>
              <Button icon={<SortAscendingOutlined />}>
                Sort {sortConfig && `(${sortConfig.key} ${sortConfig.direction})`}
                <DownOutlined />
              </Button>
            </Dropdown>

            <Dropdown 
              overlay={
                <Menu selectedKeys={[groupBy]}>
                  {groupOptions.map(option => (
                    <Menu.Item 
                      key={option.value}
                      icon={option.icon}
                      onClick={() => onGroupChange(option.value)}
                    >
                      {option.label}
                    </Menu.Item>
                  ))}
                </Menu>
              }
              trigger={['click']}
            >
              <Button icon={<GroupOutlined />}>
                {groupOptions.find(o => o.value === groupBy)?.label}
                <DownOutlined />
              </Button>
            </Dropdown>
          </Space>

          {showFilters && (
            <div className="filters-panel">
              <Space size="middle">
                <FilterDropdown
                  label="Assignee"
                  options={assignees}
                  value={filters.assignee}
                  onChange={(value) => onFilterChange({ ...filters, assignee: value })}
                />

                <FilterDropdown
                  label="Status"
                  options={statuses}
                  value={filters.status}
                  onChange={(value) => onFilterChange({ ...filters, status: value })}
                />

                <FilterDropdown
                  label="Priority"
                  options={priorities}
                  value={filters.priority}
                  onChange={(value) => onFilterChange({ ...filters, priority: value })}
                />
              </Space>
            </div>
          )}
        </Col>

        <Col>
          <Space>
            <span className="tasks-count">
              {tasksCount} {tasksCount === 1 ? 'task' : 'tasks'}
            </span>
            <Divider type="vertical" />
            <ExportButton tasks={[]} disabled={tasksCount === 0} />
          </Space>
        </Col>
      </Row>
    </div>
  );
};