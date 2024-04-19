import {
  Button,
  DatePicker,
  Form,
  Input,
  Popconfirm,
  Table,
  TimePicker,
  message,
} from 'antd';
import { useEffect, useState } from 'react';
import { ColumnsType } from 'antd/es/table';
import { useForm } from 'antd/es/form/Form';
import {
  apply,
  inventoryList,
  reject,
  unbind,
} from '../../interfaces/interfaces';
import './index.css';
import { UserSearchResult } from '../UserManage/UserManage';
import { GoodsManageResult } from '../GoodsManage';
import dayjs from 'dayjs';

export interface OnSaleSearchForm {
  username: string;
  goodsName: string;
  goodsType: string;
  rangeStartDate: Date;
  rangeEndDate: Date;
}

interface OnSaleSearchResult {
  id: number;
  startTime: string;
  endTime: string;
  status: string;
  note: string;
  createTime: string;
  updateTime: string;
  user: UserSearchResult;
  goods: GoodsManageResult;
}

export function OnSaleManage() {
  const [pageNo, setPageNo] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [onSaleSearchResult, setOnSaleSearchResult] = useState<
    Array<OnSaleSearchResult>
  >([]);
  const [num, setNum] = useState(0);

  async function changeStatus(
    id: number,
    status: 'apply' | 'reject' | 'unbind'
  ) {
    const methods = {
      apply,
      reject,
      unbind,
    };
    const res = await methods[status](id);

    if (res.status === 201 || res.status === 200) {
      message.success('状态更新成功');
      setNum(Math.random());
    } else {
      message.error(res.data.data);
    }
  }

  const columns: ColumnsType<OnSaleSearchResult> = [
    {
      title: '商品名称',
      dataIndex: 'goodsName',
      render(_, record) {
        return record.goods.name;
      },
    },
    {
      title: '操作人员',
      dataIndex: 'user',
      render(_, record) {
        return record.user.username;
      },
    },
    {
      title: '审核状态',
      dataIndex: 'status',
      onFilter: (value, record) => record.status.startsWith(value as string),
      filters: [
        {
          text: '审核通过',
          value: '审核通过',
        },
        {
          text: '审核驳回',
          value: '审核驳回',
        },
        {
          text: '申请中',
          value: '申请中',
        },
        {
          text: '已解除',
          value: '已解除',
        },
      ],
    },
    {
      title: '操作时间',
      dataIndex: 'createTime',
      render(_, record) {
        return dayjs(new Date(record.createTime)).format('YYYY-MM-DD hh:mm:ss');
      },
    },
    {
      title: '备注',
      dataIndex: 'note',
    },
    {
      title: '描述',
      dataIndex: 'description',
    },
    {
      title: '操作',
      render: (_, record) => (
        <div>
          <Popconfirm
            title="通过申请"
            description="确认通过吗？"
            onConfirm={() => changeStatus(record.id, 'apply')}
            okText="Yes"
            cancelText="No"
          >
            <a href="#">通过</a>
          </Popconfirm>
          <br />
          <Popconfirm
            title="驳回申请"
            description="确认驳回吗？"
            onConfirm={() => changeStatus(record.id, 'reject')}
            okText="Yes"
            cancelText="No"
          >
            <a href="#">驳回</a>
          </Popconfirm>
          <br />
          <Popconfirm
            title="解除申请"
            description="确认解除吗？"
            onConfirm={() => changeStatus(record.id, 'unbind')}
            okText="Yes"
            cancelText="No"
          >
            <a href="#">解除</a>
          </Popconfirm>
          <br />
        </div>
      ),
    },
  ];

  const searchOnSale = async (values: OnSaleSearchForm) => {
    const res = await inventoryList(values, pageNo, pageSize);

    const { data } = res.data;
    if (res.status === 201 || res.status === 200) {
      setOnSaleSearchResult(
        data.list.map((item: OnSaleSearchResult) => {
          return {
            key: item.id,
            ...item,
          };
        })
      );
    } else {
      message.error(data || '系统繁忙，请稍后再试');
    }
  };

  const [form] = useForm();

  useEffect(() => {
    searchOnSale({
      username: form.getFieldValue('username'),
      goodsName: form.getFieldValue('goodsName'),
      goodsType: form.getFieldValue('goodsType'),
      rangeStartDate: form.getFieldValue('rangeStartDate'),
      rangeEndDate: form.getFieldValue('rangeEndDate'),
    });
  }, [pageNo, pageSize, num]);

  const changePage = function (pageNo: number, pageSize: number) {
    setPageNo(pageNo);
    setPageSize(pageSize);
  };

  return (
    <div id="saleManage-container">
      <div className="saleManage-form">
        <Form
          form={form}
          onFinish={searchOnSale}
          name="search"
          layout="inline"
          colon={false}
        >
          <Form.Item label="操作人" name="username">
            <Input />
          </Form.Item>

          <Form.Item label="商品名称" name="goodsName">
            <Input />
          </Form.Item>

          <Form.Item label="商品类型" name="goodsType">
            <Input />
          </Form.Item>

          <Form.Item label=" ">
            <Button type="primary" htmlType="submit">
              搜索
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div className="saleManage-table">
        <Table
          columns={columns}
          dataSource={onSaleSearchResult}
          pagination={{
            current: pageNo,
            pageSize: pageSize,
            onChange: changePage,
          }}
        />
      </div>
    </div>
  );
}
