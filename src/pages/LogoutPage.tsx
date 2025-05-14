import React, { useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Spin, message } from 'antd';

const LogoutPage: React.FC = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const performLogout = async () => {
      await auth.logout();
      message.success('Logged out successfully');
      navigate('/login');
    };
    
    performLogout();
  }, [auth, navigate]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
      <Spin size="large" tip="Logging out..." />
    </div>
  );
};

export default LogoutPage;