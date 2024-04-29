import { Outlet, useLocation } from 'react-router-dom';
import { Menu as AntdMenu, MenuProps } from 'antd';
import './menu.css';
import { MenuClickEventHandler } from 'rc-menu/lib/interface';
import { router } from '../..';
import { MenuEnum, MenuPath } from '../../const/menu';

const items: MenuProps['items'] = [
  {
    key: MenuEnum.goodsManage,
    label: '商品管理',
  },
  {
    key: MenuEnum.category,
    label: '商品类别',
  },
  {
    key: MenuEnum.shelfRequest,
    label: '上下架管理',
  },
  {
    key: MenuEnum.statistics,
    label: '统计',
  },
  {
    key: MenuEnum.userManage,
    label: '用户管理',
  },
];

// 菜单跳转
const handleMenuItemClick: MenuClickEventHandler = (info) => {
  router.navigate(MenuPath[info.key]);
};

export function Menu() {
  const location = useLocation();

  // 页面刷新 根据 MenuPath 找到当前的 key 并设置给菜单
  function getSelectedKeys() {
    const curMenu = Object.entries(MenuPath).find(([key, value]) => value === location.pathname);

    return [String(curMenu?.[0] || 1)];
  }

  return (
    <div id="menu-container">
      <div className="menu-area">
        <AntdMenu defaultSelectedKeys={getSelectedKeys()} items={items} onClick={handleMenuItemClick} />
      </div>
      <div className="content-area">
        <Outlet></Outlet>
      </div>
    </div>
  );
}
