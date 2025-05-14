import React, { useState } from 'react';
import { Dropdown, Menu, Button, Input, Select } from 'antd';
import { FilterOutlined, CloseOutlined } from '@ant-design/icons';
import '../../styles/FilterDropdown.css';

const { Option } = Select;

interface FilterDropdownProps {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  allowSearch?: boolean;
  allowClear?: boolean;
  multiple?: boolean;
}

export const FilterDropdown: React.FC<FilterDropdownProps> = ({
  label,
  options,
  value,
  onChange,
  allowSearch = false,
  allowClear = true,
  multiple = false
}) => {
  const [searchText, setSearchText] = useState('');

  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleMenuClick = (e: { key: string }) => {
    onChange(e.key);
  };

  const handleClear = () => {
    onChange('');
  };

  const menu = (
    <Menu className="filter-menu">
      {allowSearch && (
        <Menu.Item key="search" disabled>
          <Input
            placeholder="Search..."
            value={searchText}
            onChange={(e:any) => setSearchText(e.target.value)}
            autoFocus
            allowClear
          />
        </Menu.Item>
      )}
      
      {multiple ? (
        <Menu.Item key="multi-select" disabled>
          <Select
            mode="multiple"
            style={{ width: '100%' }}
            placeholder={`Select ${label}`}
            value={value ? [value] : []}
            onChange={(values:any) => onChange(values.join(','))}
            dropdownStyle={{ display: 'none' }} // Hide default dropdown
          >
            {filteredOptions.map(option => (
              <Option key={option} value={option}>
                {option}
              </Option>
            ))}
          </Select>
        </Menu.Item>
      ) : (
        filteredOptions.map(option => (
          <Menu.Item 
            key={option} 
            onClick={handleMenuClick}
            className={value === option ? 'selected' : ''}
          >
            {option}
          </Menu.Item>
        ))
      )}
      
      {allowClear && value && (
        <Menu.Item key="clear" onClick={handleClear}>
          <CloseOutlined /> Clear Filter
        </Menu.Item>
      )}
    </Menu>
  );

  return (
    <Dropdown 
      overlay={menu} 
      trigger={['click']}
      overlayClassName="filter-dropdown-overlay"
    >
      <Button 
        type={value ? 'primary' : 'default'} 
        icon={<FilterOutlined />}
        className="filter-button"
      >
        {label}
        {value && !multiple && (
          <span className="filter-value">: {value}</span>
        )}
      </Button>
    </Dropdown>
  );
};