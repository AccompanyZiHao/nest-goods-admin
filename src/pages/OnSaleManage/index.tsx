import {
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  Popconfirm,
  Table,
  Tag,
  TimePicker,
  message,
} from 'antd';
import { useEffect, useState } from 'react';
import { ColumnsType } from 'antd/es/table';
import { useForm } from 'antd/es/form/Form';
import {
  apply,
  shelfRequestList,
  reject,
  unbind,
} from '../../interfaces/interfaces';
import './index.css';
import { UserSearchResult } from '../UserManage/UserManage';
import { GoodsManageResult } from '../GoodsManage';
import dayjs from 'dayjs';
import TextArea from 'antd/es/input/TextArea';

export interface OnSaleSearchForm {
  username: string;
  goodsName: string;
  goodsType: string;
  rangeStartDate: Date;
  rangeEndDate: Date;
}

export interface OnSaleSearchResult {
  request_id: number;
  startTime: string;
  endTime: string;
  request_status: number;
  request_quantity: number;
  request_type: number;
  refuse_reason: string;
  createTime: string;
  updateTime: string;
  user: UserSearchResult;
  goods: GoodsManageResult;
}

interface DialogProps {
  visible: boolean;
  handleClose: Function;
  handleOk: Function;
}

export function OnSaleManage() {
  const [pageNo, setPageNo] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [onSaleSearchResult, setOnSaleSearchResult] = useState<
    Array<OnSaleSearchResult>
  >([]);
  const [num, setNum] = useState(0);

  const [rowInfo, setRowInfo] = useState(null);
  const [visible, setVisible] = useState(false);

  async function changeStatus(
    row: OnSaleSearchResult,
    status: 'apply' | 'reject' | 'unbind',
    content?: string
  ) {
    const methods = {
      apply,
      reject,
      unbind,
    };
    const res = await methods[status](row, content);

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
      title: '数量',
      dataIndex: 'request_quantity',
    },
    {
      title: '申请类型',
      dataIndex: 'request_type',
      render(_, record) {
        return record.request_type === 1 ? '上架' : '下架';
      },
    },
    // {
    //   title: '货架位置',
    //   dataIndex: 'location',
    // },
    {
      title: '审核状态',
      dataIndex: 'request_status',
      render(_, record) {
        return {
          1: <Tag color="processing">等待中</Tag>,
          2: <Tag color="success">成功</Tag>,
          3: <Tag color="error">失败</Tag>,
          4: <Tag color="default">已取消</Tag>,
        }[record.request_status];
      },
    },
    {
      title: '操作时间',
      dataIndex: 'createTime',
      render(_, record) {
        return dayjs(new Date(record.createTime)).format('YYYY-MM-DD hh:mm:ss');
      },
    },
    {
      title: '拒绝原因',
      dataIndex: 'refuse_reason',
    },
    {
      title: '备注',
      dataIndex: 'description',
    },
    {
      title: '操作',
      render: (_, record) =>
        record.request_status === 1 && (
          <div>
            <Popconfirm
              title="通过申请"
              description="确认通过吗？"
              onConfirm={() => changeStatus(record, 'apply')}
              okText="Yes"
              cancelText="No"
            >
              <a href="#">通过</a>
            </Popconfirm>
            <br />
            {/* <Popconfirm
            title="驳回申请"
            description="确认驳回吗？"
            onConfirm={() => changeStatus(record.id, 'reject')}
            okText="Yes"
            cancelText="No"
          ></Popconfirm> */}
            <a
              href="#"
              onClick={() => {
                setRowInfo(record);
                setVisible(true);
              }}
            >
              驳回
            </a>
            <br />
            {/* <Popconfirm
            title="解除申请"
            description="确认解除吗？"
            onConfirm={() => changeStatus(record.id, 'unbind')}
            okText="Yes"
            cancelText="No"
          >
            <a href="#">解除</a>
          </Popconfirm> */}
            <br />
          </div>
        ),
    },
  ];

  const searchOnSale = async (values: OnSaleSearchForm) => {
    const res = await shelfRequestList(values, pageNo, pageSize);

    const { data } = res.data;
    if (res.status === 201 || res.status === 200) {
      setOnSaleSearchResult(
        data.list.map((item: OnSaleSearchResult) => {
          return {
            key: item.request_id,
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
    <>
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
      <Dialog
        visible={visible}
        handleClose={() => {
          setVisible(false);
        }}
        handleOk={(reason) => {
          changeStatus(rowInfo, 'reject', reason);
          setVisible(false);
        }}
      />
    </>
  );
}

function Dialog(props: DialogProps) {
  const [reason, setReason] = useState('');
  const onOk = () => {
    if (!reason) return message.warning('驳回原因不能为空！');
    props.handleOk(reason);
  };

  useEffect(() => {
    if (props.visible) {
      setReason('');
    }
  }, [props.visible]);

  return (
    <Modal
      title="驳回原因"
      open={props.visible}
      onOk={onOk}
      onCancel={() => props.handleClose()}
    >
      <div style={{ paddingBottom: '20px' }}>
        <TextArea
          value={reason}
          onChange={(e) => setReason(String(e.target.value))}
          rows={4}
          showCount
          placeholder="请输入驳回的原因"
          maxLength={100}
        />
      </div>
    </Modal>
  );
}
