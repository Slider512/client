import React from 'react';
import { Layout as AntLayout, Menu, Button } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import './Layout.css';

const { Header, Content, Sider } = AntLayout;

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/logout');
  };

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <Header className="header">
        <div className="logo" />
        <div style={{ float: 'right' }}>
          <span style={{ color: 'white', marginRight: '16px' }}>
            {auth.login?.name}
          </span>
          <Button type="text" onClick={handleLogout} style={{ color: 'white' }}>
            Logout
          </Button>
        </div>
      </Header>
      <AntLayout>
        <Sider width={200} className="site-layout-background">
          <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            style={{ height: '100%', borderRight: 0 }}
          >
            <Menu.Item key="1">
              <Link to="/">Dashboard</Link>
            </Menu.Item>
            <Menu.Item key="2">
              <Link to="/tasks">Task Board</Link>
            </Menu.Item>
          </Menu>
        </Sider>
        <AntLayout style={{ padding: '24px' }}>
          <Content className="site-layout-background">
            {children}
          </Content>
        </AntLayout>
      </AntLayout>
    </AntLayout>
  );
};

export default Layout;