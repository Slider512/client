import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button, message, Input, Form } from 'antd';
import { confirmEmailApi, resendConfirmationApi } from '../api/authApi';

const ConfirmEmailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [resendLoading, setResendLoading] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const confirmEmail = async () => {
      const userId = searchParams.get('userId');
      const token = searchParams.get('token');

      if (!userId || !token) {
        setStatus('error');
        message.error('Invalid confirmation link');
        return;
      }

      try {
        await confirmEmailApi(userId, token);
        setStatus('success');
        message.success('Email confirmed successfully!');
      } catch (error) {
        setStatus('error');
        message.error('Email confirmation failed');
      }
    };

    confirmEmail();
  }, [searchParams]);

  const handleResend = async () => {
    if (!email) {
      message.error('Please enter your email.');
      return;
    }
    setResendLoading(true);
    try {
      await resendConfirmationApi(email);
      message.success('Confirmation email resent successfully.');
    } catch (error: any) {
      message.error(error.message || 'Failed to resend confirmation email.');
    } finally {
      setResendLoading(false);
    }
  };

  if (status === 'loading') {
    return <div>Verifying email...</div>;
  }

  return (
    <div style={{ maxWidth: 400, margin: '100px auto', textAlign: 'center' }}>
      {status === 'success' ? (
        <>
          <h2>Email Confirmed</h2>
          <p>Your email has been successfully confirmed.</p>
          <Button type="primary" onClick={() => navigate('/login')}>
            Go to Login
          </Button>
        </>
      ) : (
        <>
          <h2>Confirmation Failed</h2>
          <p>There was an error confirming your email. Please try resending the confirmation email.</p>
          <Form onFinish={handleResend}>
            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Please input your email!' },
                { type: 'email', message: 'Please enter a valid email!' },
              ]}
            >
              <Input
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={resendLoading}>
                Resend Confirmation Email
              </Button>
            </Form.Item>
            <Button type="link" onClick={() => navigate('/register')} block>
              Back to Register
            </Button>
          </Form>
        </>
      )}
    </div>
  );
};

export default ConfirmEmailPage;