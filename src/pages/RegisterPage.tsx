import React, { useState } from 'react';
import { Form, Input, Button, Typography, Alert, Space } from 'antd';
import { MailOutlined, LockOutlined, HomeOutlined } from '@ant-design/icons';
import { registerApi } from '../api/authApi';
import { Link } from 'react-router-dom';
import './RegisterPage.css';

const { Title, Text } = Typography;

const RegisterPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onFinish = async (values: { email: string; password: string; confirmPassword: string; companyName: string }) => {
    setLoading(true);
    setMessage(null);
    setError(null);
    try {
      const { email, password, companyName } = values;
      const response = await registerApi({ email, password, companyName });
      setMessage(response.message);
    } catch (err: any) {
      setError(err.message || 'Ошибка регистрации');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Title level={2} style={{ textAlign: 'center' }}>
          Регистрация
        </Title>
        {message && <Alert message={message} type="success" showIcon />}
        {error && <Alert message={error} type="error" showIcon />}
        <Form
          name="register"
          initialValues={{ email: '', password: '', confirmPassword: '', companyName: '' }}
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Пожалуйста, введите email!' },
              { type: 'email', message: 'Введите корректный email!' },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" size="large" />
          </Form.Item>

          <Form.Item
            label="Пароль"
            name="password"
            rules={[
              { required: true, message: 'Пожалуйста, введите пароль!' },
              { min: 8, message: 'Пароль должен содержать минимум 8 символов!' },
              {
                pattern: /^(?=.*\d)(?=.*[A-Z])(?=.*[!@#$%^&*]).*$/,
                message: 'Пароль должен содержать цифру, заглавную букву и спецсимвол!',
              },
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Пароль" size="large" />
          </Form.Item>

          <Form.Item
            label="Подтверждение пароля"
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Пожалуйста, подтвердите пароль!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Пароли не совпадают!'));
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Подтверждение пароля" size="large" />
          </Form.Item>

          <Form.Item
            label="Название компании"
            name="companyName"
            rules={[{ required: true, message: 'Пожалуйста, введите название компании!' }]}
          >
            <Input prefix={<HomeOutlined />} placeholder="Название компании" size="large" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block size="large">
              Зарегистрироваться
            </Button>
          </Form.Item>

          <Form.Item>
            <Text>
              Уже есть аккаунт? <Link to="/login">Войти</Link>
            </Text>
          </Form.Item>
        </Form>
      </Space>
    </div>
  );
};

export default RegisterPage;