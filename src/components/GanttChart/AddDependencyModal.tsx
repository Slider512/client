import React, { useState } from 'react';
import { DependencyType } from '../../models';
import { Button, Select, Modal, Alert } from 'antd';
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';
import '../../styles/AddDependencyModal.css';

const { Option } = Select;

interface AddDependencyModalProps {
  visible: boolean;
  fromTask?: { id: string; title: string };
  toTask?: { id: string; title: string };
  onCancel: () => void;
  onCreate: (type: DependencyType) => Promise<void>;
}

export const AddDependencyModal: React.FC<AddDependencyModalProps> = ({
  visible,
  fromTask,
  toTask,
  onCancel,
  onCreate
}) => {
  const [dependencyType, setDependencyType] = useState<DependencyType>('FS');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!fromTask || !toTask) return;
    
    setLoading(true);
    setError(null);
    
    try {
      await onCreate(dependencyType);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create dependency');
    } finally {
      setLoading(false);
    }
  };

  const dependencyTypes = [
    { value: 'FS', label: 'Finish-to-Start (FS)' },
    { value: 'FF', label: 'Finish-to-Finish (FF)' },
    { value: 'SS', label: 'Start-to-Start (SS)' },
    { value: 'SF', label: 'Start-to-Finish (SF)' }
  ];

  return (
    <Modal
      title="Add Dependency"
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" icon={<CloseOutlined />} onClick={onCancel}>
          Cancel
        </Button>,
        <Button
          key="create"
          type="primary"
          icon={<CheckOutlined />}
          loading={loading}
          onClick={handleCreate}
          disabled={!fromTask || !toTask}
        >
          Create Dependency
        </Button>
      ]}
      className="dependency-modal"
    >
      <div className="dependency-info">
        {fromTask && (
          <div className="task-info">
            <span className="label">From Task:</span>
            <span className="value">{fromTask.title}</span>
          </div>
        )}
        
        {toTask && (
          <div className="task-info">
            <span className="label">To Task:</span>
            <span className="value">{toTask.title}</span>
          </div>
        )}
      </div>

      <div className="dependency-type">
        <span className="label">Dependency Type:</span>
        <Select
          value={dependencyType}
          onChange={(value: DependencyType) => setDependencyType(value)}
          style={{ width: '100%' }}
        >
          {dependencyTypes.map(type => (
            <Option key={type.value} value={type.value}>
              {type.label}
            </Option>
          ))}
        </Select>
      </div>

      {error && (
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          closable
          onClose={() => setError(null)}
        />
      )}

      <div className="dependency-help">
        <h4>Dependency Types:</h4>
        <ul>
          <li><strong>FS (Finish-to-Start):</strong> Task B cannot start until Task A finishes</li>
          <li><strong>FF (Finish-to-Finish):</strong> Task B cannot finish until Task A finishes</li>
          <li><strong>SS (Start-to-Start):</strong> Task B cannot start until Task A starts</li>
          <li><strong>SF (Start-to-Finish):</strong> Task B cannot finish until Task A starts</li>
        </ul>
      </div>
    </Modal>
  );
};