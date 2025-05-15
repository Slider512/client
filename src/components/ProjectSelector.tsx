import React, { useState, useEffect } from 'react';
import { Select, Button, Modal, Form, Input, message } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { fetchProjects, createProject, deleteProject } from '../api/projectApi';
import { Project } from '../models/Project';

interface ProjectSelectorProps {
  selectedProjectId: string | null;
  onSelectProject: (projectId: string | null) => void;
}

const ProjectSelector: React.FC<ProjectSelectorProps> = ({ selectedProjectId, onSelectProject }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  // Загрузка проектов при монтировании
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await fetchProjects();
        setProjects(data);
      } catch (error) {
        message.error('Failed to load projects');
      }
    };
    loadProjects();
  }, []);

  // Обработчик добавления проекта
  const handleAddProject = async (values: { name: string; description?: string }) => {
    try {
      const newProject = await createProject(values);
      setProjects([...projects, newProject]);
      form.resetFields();
      setIsModalVisible(false);
      message.success('Project created successfully');
    } catch (error) {
      message.error('Failed to create project');
    }
  };

  // Обработчик удаления проекта
  const handleDeleteProject = async (id: string) => {
    try {
      await deleteProject(id);
      setProjects(projects.filter((p) => p.id !== id));
      if (selectedProjectId === id) {
        onSelectProject(null);
      }
      message.success('Project deleted successfully');
    } catch (error) {
      message.error('Failed to delete project');
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
      <Select
        style={{ width: 200 }}
        placeholder="Select a project"
        value={selectedProjectId}
        onChange={onSelectProject}
        allowClear
      >
        {projects.map((project) => (
          <Select.Option key={project.id} value={project.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {project.name}
              <DeleteOutlined
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteProject(project.id);
                }}
                style={{ color: 'red' }}
              />
            </div>
          </Select.Option>
        ))}
      </Select>
      <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
        Add Project
      </Button>

      <Modal
        title="Create New Project"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} onFinish={handleAddProject} layout="vertical">
          <Form.Item
            name="name"
            label="Project Name"
            rules={[{ required: true, message: 'Please input the project name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProjectSelector;