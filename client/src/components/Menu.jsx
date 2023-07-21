import React from 'react';
import { DownOutlined } from '@ant-design/icons';

import { Dropdown, Space } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useToasts } from 'react-toast-notifications';

import { logout } from '../action/userAction';

const Menu = ({ user }) => {
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const { addToast } = useToasts();

  const logoutHandler = () => {
    dispatch(logout());
    addToast('Logged out successfully', {
      appearance: 'success',
      autoDismiss: true,
    });
    navigate('/');
  };

  const items = [
    {
      key: '2',
      label:
        user && user.role !== 'admin' ? (
          <Link style={{ textDecoration: 'none' }} to="/orders/me">
            Orders
          </Link>
        ) : (
          <Link style={{ textDecoration: 'none' }} to="/dashboard">
            Dashboard
          </Link>
        ),
    },
    {
      key: '3',
      label: (
        <Link style={{ textDecoration: 'none' }} to="/me">
          Profile
        </Link>
      ),
    },
    {
      key: '4',
      danger: true,
      label: 'Logout',
      onClick: logoutHandler,
    },
  ];

  return (
    <Dropdown menu={{ items }}>
      <Link onClick={(e) => e.preventDefault()}>
        <Space>
          <figure className="avatar avatar-nav">
            <img
              src={user.avatar && user.avatar.url}
              alt={user && user.name}
              className="rounded-circle"
            />
          </figure>
          <span className="text-white" style={{ textDecoration: 'none' }}>
            {user && user.name}
          </span>
          <DownOutlined className="text-white" />
        </Space>
      </Link>
    </Dropdown>
  );
};
export default Menu;
