import { Outlet, useLocation } from "react-router-dom";
import { Menu as AntdMenu, MenuProps } from 'antd';
import './menu.css';
import { router } from "../..";
import { MenuClickEventHandler } from "rc-menu/lib/interface";
import { logout as logoutApi } from '../../interfaces/interfaces';

const items: MenuProps['items'] = [
  {
    key: '1',
    label: '信息修改',
  },
  {
    key: '2',
    label: '密码修改',
  },
  {
    key: '3',
    label: '退出',
  },
];

const handleMenuItemClick: MenuClickEventHandler = (info) => {
  if (info.key === '1') {
    router.navigate('/user/info-modify');
  } else if (info.key === '2') {
    router.navigate('/user/password-modify');
  } else if (info.key === '3') {
    logoutApi();
    localStorage.clear();
    router.navigate('/login');
  }
};

export function ModifyMenu() {
  const location = useLocation();

  return (
    <div id="menu-container">
      <div className="menu-area">
        <AntdMenu
          defaultSelectedKeys={
            location.pathname === '/user/info-modify' ? ['1'] : ['2']
          }
          items={items}
          onClick={handleMenuItemClick}
        />
      </div>
      <div className="content-area">
        <Outlet></Outlet>
      </div>
    </div>
  );
}
