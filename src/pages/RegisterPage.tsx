import { Form, Input, Button, message } from 'antd';
import { useAuth } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { resendConfirmationApi } from '../api/authApi';

const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);

  const onFinish = async (values: { username: string; password: string; companyName: string; email: string }) => {
    setLoading(true);
    try {
      await register(values.username, values.password, values.companyName, values.email);
      setRegisteredEmail(values.email);
      message.success('Registration successful! Please check your email to confirm your account.');
    } catch (error: any) {
      message.error(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!registeredEmail) {
      message.error('Please register first.');
      return;
    }
    setResendLoading(true);
    try {
      await resendConfirmationApi(registeredEmail);
      message.success('Confirmation email resent successfully.');
    } catch (error: any) {
      message.error(error.message || 'Failed to resend confirmation email.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '100px auto' }}>
      <h2>Register</h2>
      {registeredEmail ? (
        <div style={{ textAlign: 'center' }}>
          <p>Please check your email ({registeredEmail}) to confirm your account.</p>
          <Button type="primary" onClick={handleResend} loading={resendLoading} style={{ marginTop: 16 }}>
            Resend Confirmation Email
          </Button>
          <Button type="link" onClick={() => navigate('/login')} style={{ marginTop: 16 }} block>
            Go to Login
          </Button>
        </div>
      ) : (
        <Form onFinish={onFinish}>
          <Form.Item
            name="companyName"
            rules={[{ required: true, message: 'Please input your company name!' }]}
          >
            <Input placeholder="Company Name" />
          </Form.Item>
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input placeholder="Username" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Please input your password!' },
              { min: 8, message: 'Password must be at least 8 characters!' },
              {
                pattern: /^(?=.*\d)(?=.*[A-Z])(?=.*[!@#$%^&*]).*$/,
                message: 'Password must contain a digit, uppercase letter, and special character!',
              },
            ]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>
          <Form.Item
          name="confirmPassword"
          rules={[
            { required: true, message: 'Please confirm your password!' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Passwords do not match!'));
              },
            }),
          ]}
        >
          <Input.Password placeholder="Confirm Password" />
        </Form.Item>
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' },
            ]}
          >
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Register
            </Button>
          </Form.Item>
          <Form.Item>
            <Button type="link" onClick={() => navigate('/login')} block>
              Already have an account? Login
            </Button>
          </Form.Item>
        </Form>
      )}
    </div>
  );
};

export default RegisterPage;