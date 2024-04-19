import { message } from 'antd';
import axios from 'axios';
import { UserInfo } from '../pages/InfoModify/InfoModify';
import { UpdatePassword } from '../pages/PasswordModify/PasswordModify';
import { CreateGoodsForm } from '../pages/GoodsManage/CreateModal';
import { UpdateGoodsForm } from '../pages/GoodsManage/UpdateModal';
import type { OnSaleSearchForm } from '../pages/OnSaleManage';
import dayjs from 'dayjs';
import { BASE_URL } from '../const/base';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 3000,
});

axiosInstance.interceptors.request.use(function (config) {
  const accessToken = localStorage.getItem('access_token');

  if (accessToken) {
    config.headers.authorization = 'Bearer ' + accessToken;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    let { data, config } = response;

    if (data.code === 401 && !config?.url?.includes('/user/refresh')) {
      setTimeout(() => {
        window.location.href = '/login';
      }, 1500);
    }
    return response;
  },
  async (error) => {
    if (!error.response) {
      return Promise.reject(error);
    }
    let { data, config } = error.response;

    if (data.code === 401 && !config.url.includes('/user/admin/refresh')) {
      const res = await refreshToken();

      if (res.status === 200) {
        return axios(config);
      } else {
        message.error(res.data);

        setTimeout(() => {
          window.location.href = '/login';
        }, 1500);
      }
    } else {
      return error.response;
    }
  }
);

async function refreshToken() {
  const res = await axiosInstance.get('/user/admin/refresh', {
    params: {
      refresh_token: localStorage.getItem('refresh_token'),
    },
  });
  localStorage.setItem('access_token', res.data.access_token);
  localStorage.setItem('refresh_token', res.data.refresh_token);
  return res;
}

export async function login(username: string, password: string) {
  return await axiosInstance.post('/user/admin/login', {
    username,
    password,
  });
}

export async function userSearch(
  username: string,
  nickName: string,
  email: string,
  pageNo: number,
  pageSize: number
) {
  return await axiosInstance.get('/user/list', {
    params: {
      username,
      nickName,
      email,
      pageNo,
      pageSize,
    },
  });
}

export async function freeze(id: number) {
  return await axiosInstance.get('/user/freeze', {
    params: {
      id,
    },
  });
}

export async function getUserInfo() {
  return await axiosInstance.get('/user/info');
}

export async function updateInfo(data: UserInfo) {
  return await axiosInstance.post('/user/admin/update', data);
}

export async function updateUserInfoCaptcha() {
  return await axiosInstance.get('/user/update/captcha');
}

export async function updatePasswordCaptcha(email: string) {
  return await axiosInstance.get('/user/update_password/captcha', {
    params: {
      address: email,
    },
  });
}

export async function updatePassword(data: UpdatePassword) {
  return await axiosInstance.post('/user/admin/update_password', data);
}

export async function searchGoodsList(
  name: string,
  id: number,
  kind: number,
  pageNo: number,
  pageSize: number
) {
  return await axiosInstance.get('/goods/list', {
    params: {
      name,
      id,
      kind,
      pageNo,
      pageSize,
    },
  });
}

export async function deleteGoods(id: number) {
  return await axiosInstance.delete('/goods/' + id);
}

export async function createGoods(goods: CreateGoodsForm) {
  return await axiosInstance.post('/goods/create', goods);
}

export async function updateGoods(goods: UpdateGoodsForm) {
  return await axiosInstance.post('/goods/update', goods);
}

export async function findGoods(id: number) {
  return await axiosInstance.get('/goods/' + id);
}

export async function inventoryList(
  SearchForm: OnSaleSearchForm,
  pageNo: number,
  pageSize: number
) {
  let rangeStartDate;
  let rangeEndDate;

  if (SearchForm.rangeStartDate) {
    rangeStartDate = dayjs(SearchForm.rangeStartDate).format('YYYY-MM-DD');
  }

  if (SearchForm.rangeEndDate) {
    rangeEndDate = dayjs(SearchForm.rangeEndDate).format('YYYY-MM-DD');
  }

  return await axiosInstance.get('/inventory/list', {
    params: {
      username: SearchForm.username,
      goodsName: SearchForm.goodsName,
      goodsType: SearchForm.goodsType,
      rangeStartDate,
      rangeEndDate,
      pageNo: pageNo,
      pageSize: pageSize,
    },
  });
}

export async function apply(id: number) {
  return await axiosInstance.get('/inventory/apply/' + id);
}

export async function reject(id: number) {
  return await axiosInstance.get('/inventory/reject/' + id);
}

export async function unbind(id: number) {
  return await axiosInstance.get('/inventory/unbind/' + id);
}

export async function meetingRoomUsedCount(startTime: string, endTime: string) {
  return await axiosInstance.get('/statistic/meetingRoomUsedCount', {
    params: {
      startTime,
      endTime,
    },
  });
}

export async function userBookingCount(startTime: string, endTime: string) {
  return await axiosInstance.get('/statistic/userBookingCount', {
    params: {
      startTime,
      endTime,
    },
  });
}
