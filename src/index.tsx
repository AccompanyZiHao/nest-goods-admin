import ReactDOM from 'react-dom/client';
import './index.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Index } from './pages/Index/Index';
import { ErrorPage } from './pages/ErrorPage/ErrorPage';
import { UserManage } from './pages/UserManage/UserManage';
import { Login } from './pages/Login/Login';
import { Menu } from './pages/Menu/Menu';
import { ModifyMenu } from './pages/ModifyMenu/ModifyMenu';
import { InfoModify } from './pages/InfoModify/InfoModify';
import { PasswordModify } from './pages/PasswordModify/PasswordModify';
import { GoodsManage } from './pages/GoodsManage';
import { OnSaleManage } from './pages/OnSaleManage';
import { Statistics } from './pages/Statistics/Statistics';
import { Category } from './pages/Category';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';

import { MenuEnum, MenuPath } from './const/menu';

const routes = [
  {
    path: '/',
    element: <Index></Index>,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <Menu></Menu>,
        children: [
          {
            path: '/',
            element: <GoodsManage />,
          },
          {
            path: 'user-manage',
            element: <UserManage />,
          },
          {
            path: 'goods-manage',
            element: <GoodsManage />,
          },
          {
            path: 'shelf-request',
            element: <OnSaleManage />,
          },
          {
            path: 'statistics',
            element: <Statistics />,
          },
          {
            path: MenuPath[MenuEnum.category],
            element: <Category />,
          },
        ],
      },
      {
        path: '/user',
        element: <ModifyMenu></ModifyMenu>,
        children: [
          {
            path: 'info-modify',
            element: <InfoModify />,
          },
          {
            path: 'password-modify',
            element: <PasswordModify />,
          },
        ],
      },
    ],
  },
  {
    path: 'login',
    element: <Login />,
  },
];
export const router = createBrowserRouter(routes);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const App = <ConfigProvider locale={zhCN}>
  <RouterProvider router={router}/>
</ConfigProvider>

root.render(App);
