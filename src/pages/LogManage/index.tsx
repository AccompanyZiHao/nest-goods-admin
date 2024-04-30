import { Badge, Button, Form, Image, Input, Select, Popconfirm, Table, message, Tag } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { logList } from '../../interfaces/interfaces';
import { useForm } from 'antd/es/form/Form';
import { OperatorTimeColum } from '../../components/Time';

interface TableRow {
  operId: number;
  operName: string;
  businessType: number;
  operTime: Date;
  operUrl: string;
  status: number;
  operParam: string;
  title: string;
  errorMsg: string;
}

enum BusinessTypeEnum {
  '初始化' = 1,

  '其他',

  /* 查询 */
  '查询',

  /* 插入 */
  '新增',

  /* 更新 */
  '更新',

  /* 删除 */
  '删除',

  /* 强退 */
  '强制退出',

  /* 清除 */
  '清除',
}

export const LogManage = () => {
  const [pageNo, setPageNo] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [list, setList] = useState<Array<TableRow>>([]);
  const [total, setTotal] = useState<number>(0);

  const [form] = useForm();

  const columns: ColumnsType<TableRow> = useMemo(
    () => [
      {
        title: '用户',
        dataIndex: 'operName',
      },
      {
        title: '操作模块',
        dataIndex: 'title',
      },
      {
        title: '操作类型',
        dataIndex: 'businessType',
        render: (_, record) => BusinessTypeEnum[record.businessType],
      },
      {
        title: 'URL',
        dataIndex: 'operUrl',
      },
      {
        title: '请求参数',
        dataIndex: 'operParam',
      },
      {
        title: '请求状态',
        dataIndex: 'status',
        width: 150,
        render: (_, record) =>
          record.status ? (
            <div>
              <Tag color="error">请求失败</Tag>
              <div style={{ padding: '5px 0' }}>{record.errorMsg}</div>
            </div>
          ) : (
            <Tag color="success">请求成功</Tag>
          ),
      },
      OperatorTimeColum,
    ],
    []
  );

  const searchHandler = async (values) => {
    const res = await logList({
      pageNo,
      pageSize,
    });
    const { data } = res.data;
    if (res.status === 201 || res.status === 200) {
      setList(
        data.list.map((item: TableRow) => {
          return {
            key: item.operId,
            ...item,
          };
        })
      );

      setTotal(data.totalCount);
    } else {
      message.error(data || '系统繁忙，请稍后再试');
    }
  };

  const changePage = useCallback(function (pageNo: number, pageSize: number) {
    setPageNo(pageNo);
    setPageSize(pageSize);
  }, []);

  useEffect(() => {
    searchHandler({});
  }, [pageNo, pageSize]);

  return (
    <div id="container">
      <div className="form">
        <Form
          form={form}
          onFinish={() => {
            setPageNo(1);
            // setRefresh(true);
          }}
          name="search"
          layout="inline"
          colon={false}
        >
          {/* <Form.Item label="商品类型" name="kind" style={{ width: 200 }}>
            <CategorySelect />
          </Form.Item>


          <Form.Item label=" ">
            <Button htmlType="submit">搜索</Button>
            <Button type="primary" onClick={() => setIsCreateModalOpen(true)}>
              添加
            </Button>
          </Form.Item> */}
        </Form>
      </div>
      <div className="table">
        <Table
          columns={columns}
          dataSource={list}
          pagination={{
            current: pageNo,
            pageSize: pageSize,
            onChange: changePage,
            total,
          }}
        />
      </div>
    </div>
  );
};
