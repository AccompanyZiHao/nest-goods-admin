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
import { showConfirm } from '../../components/confirm';
import { CreateTimeColumn, UpdateTimeColumn } from './../../components/Time';

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
      CreateTimeColumn,
      UpdateTimeColumn,
      {
        title: '操作',
        width: 160,
        render: (_, record) => (
          <div>
            <Button
              type="primary"
              size="small"
              danger
              onClick={() =>
                showConfirm(
                  {
                    content: `确认删除商品类别【${record.category_name}】吗？`,
                  },
                  () => {
                    handleDelete(record.category_id);
                  }
                )
              }
            >
              删除
            </Button>

            <Button
              type="primary"
              size="small"
              onClick={() => {
                setIsUpdateModalOpen(true);
                setRow(record);
              }}
            >
              编辑
            </Button>
          </div>
        ),
      },
    ],
    []
  );

  // 搜索
  const searchHandle = async (values: SearchCategory, initPage?: number) => {
    const res = await searchCategoryList(values.category_name, initPage ? 1 : pageNo, pageSize);

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
  };

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
  }, [refresh]);

  // 分页查询
  const changePage = useCallback(function (pageNo: number, pageSize: number) {
    setPageNo(pageNo);
    setPageSize(pageSize);
    setRefresh(true);
  }, []);

  return (
    <div id="container">
      <div className="form">
        <Form
          form={form}
          onFinish={() => {
            setPageNo(1);
            setRefresh(true);
          }}
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
            total,
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
