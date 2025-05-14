import React, { useState } from 'react';
import { Form, Input, Button, Typography, Alert, Space } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useAuth } from '../auth/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import './LoginPage.css';

const { Title, Text } = Typography;

const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { login, error } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      await login({ email: values.email, password: values.password });
      navigate('/'); // Redirect to dashboard after successful login
    } catch (err) {
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Title level={2} style={{ textAlign: 'center' }}>
          Login
        </Title>
        {error && <Alert message={error} type="error" showIcon />}
        <Form
          name="login"
          initialValues={{ email: '', password: '' }}
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Email" size="large" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" size="large" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block size="large">
              Log In
            </Button>
          </Form.Item>

          <Form.Item>
            <Text>
              Don't have an account? <Link to="/register">Register</Link>
            </Text>
          </Form.Item>
          <Form.Item>
            <Text>
              Need to confirm your email? <Link to="/resend-confirmation">Resend Confirmation</Link>
            </Text>
          </Form.Item>
        </Form>
      </Space>
    </div>
  );
};

export default LoginPage;