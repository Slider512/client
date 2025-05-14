import React from 'react';
import { Result, Button } from 'antd';
import { Link } from 'react-router-dom';
import './NotFoundPage.css';

const NotFoundPage: React.FC = () => {
  return (
    <div className="not-found-page">
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={
          <Button type="primary">
            <Link to="/">Back to Dashboard</Link>
          </Button>
        }
      />
    </div>
  );
};

export default NotFoundPage;