import { Button, Form, Input, message, Modal, Popconfirm, Table } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { ColumnsType } from 'antd/es/table';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  deleteCategory,
  searchCategoryList,
} from '../../interfaces/interfaces';

import { CreateCategoryModal } from './CreateModal';
import { UpdateCategoryModal } from './UpdateModal';

export interface SearchCategory {
  category_name: string;
}

export interface CategoryResult {
  category_name: string;
  category_id: number;
  createTime: string;
  updateTime: string;
}

// 分类管理
export function Category() {
  // 分页
  const [pageNo, setPageNo] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);
  // 刷新
  const [refresh, setRefresh] = useState(true);
  // 列表数据
  const [tableData, setTableData] = useState<Array<CategoryResult>>([]);
  // 创建/编辑弹窗
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  // 当前选中的信息
  const [row, setRow] = useState<CategoryResult>();

  const [form] = useForm();

  const columns: ColumnsType<CategoryResult> = useMemo(
    () => [
      {
        title: ' ID',
        dataIndex: 'category_id',
      },
      {
        title: '类别名称',
        dataIndex: 'category_name',
      },
      {
        title: '添加时间',
        dataIndex: 'createTime',
      },
      {
        title: '上次更新时间',
        dataIndex: 'updateTime',
      },
      {
        title: '操作',
        render: (_, record) => (
          <div>
            <Popconfirm
              title="商品删除"
              description="确认删除吗？"
              onConfirm={() => handleDelete(record.category_id)}
              okText="Yes"
              cancelText="No"
            >
              <a href="#">删除</a>
            </Popconfirm>
            <br />
            <a
              href="#"
              onClick={() => {
                setIsUpdateModalOpen(true);
                setRow(record);
              }}
            >
              编辑
            </a>
          </div>
        ),
      },
    ],
    []
  );

  // 搜索
  const searchHandle = useCallback(
    async (values: SearchCategory, initPage?: number) => {
      const res = await searchCategoryList(
        values.category_name,
        initPage ? 1 : pageNo,
        pageSize
      );

      const { data } = res.data;
      if (res.status === 201 || res.status === 200) {
        setTableData(
          data.list.map((item: CategoryResult) => {
            return {
              key: item.category_id,
              ...item,
            };
          })
        );
        setTotal(data.totalCount);
      } else {
        message.error(data || '系统繁忙，请稍后再试');
      }

      setRefresh(false);
    },
    []
  );

  // 删除
  const handleDelete = useCallback(async (id: number) => {
    try {
      await deleteCategory(id);
      message.success('删除成功');
      setRefresh(true);
    } catch (e) {
      console.log(e);
      message.error('删除失败');
    }
  }, []);

  useEffect(() => {
    if (refresh === true) {
      searchHandle({
        category_name: form.getFieldValue('category_name'),
      });
    }
  }, [pageNo, pageSize, refresh]);

  // 分页查询
  const changePage = useCallback(function (pageNo: number, pageSize: number) {
    setPageNo(pageNo);
    setPageSize(pageSize);
  }, []);

  return (
    <div id="container">
      <div className="form">
        <Form
          form={form}
          onFinish={searchHandle}
          name="search"
          layout="inline"
          colon={false}
        >
          <Form.Item label="名称" name="category_name">
            <Input />
          </Form.Item>

          <Form.Item label=" ">
            <Button htmlType="submit">搜索</Button>
            <Button type="primary" onClick={() => setIsCreateModalOpen(true)}>
              添加
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div className="table">
        <Table
          columns={columns}
          dataSource={tableData}
          pagination={{
            current: pageNo,
            pageSize: pageSize,
            onChange: changePage,
          }}
        />
      </div>

      <CreateCategoryModal
        isOpen={isCreateModalOpen}
        handleClose={() => {
          setIsCreateModalOpen(false);
          setRefresh(true);
        }}
      />
      <UpdateCategoryModal
        row={row}
        isOpen={isUpdateModalOpen}
        handleClose={() => {
          setIsUpdateModalOpen(false);
          setRefresh(true);
        }}
      ></UpdateCategoryModal>
    </div>
  );
}
