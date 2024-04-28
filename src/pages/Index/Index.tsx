import { UserOutlined } from '@ant-design/icons';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import './index.css';
import { useEffect, useState } from 'react';
import { BASE_URL, DEFAULT_IMAGE } from '../../const/base';

interface UserInfoType {
  username: string;
  headPic: string;
  [key: string]: string;
}

export const getUserInfo = () => {
  const userInfoStr = localStorage.getItem('user_info');

  if (userInfoStr) {
    return JSON.parse(userInfoStr);
  }
  return '';
};

export function Index() {
  const [userInfo, setUserInfo] = useState<UserInfoType>();

  useEffect(() => {
    setUserInfo(getUserInfo());
  }, []);

  const navigate = useNavigate();
  const toUserInfoPage = () => {
    navigate('/user/info-modify');
  };

  return (
    <div id="index-container">
      <div className="header">
        <Link to="/" className="sys_name">
          <h1>超市系统-后台管理</h1>
        </Link>
        {userInfo ? (
          <div className="dsf aic jcc" onClick={toUserInfoPage}>
            {userInfo?.nickName}
            <img
              src={BASE_URL + (userInfo?.headPic || DEFAULT_IMAGE)}
              alt=""
              style={{ width: '50px', height: '50px', borderRadius: '50%' }}
            />
          </div>
        ) : (
          <Link to="/user/info-modify">
            <UserOutlined className="icon" />
          </Link>
        )}
      </div>
      <div className="body">
        <Outlet></Outlet>
      </div>
    </div>
  );
}
