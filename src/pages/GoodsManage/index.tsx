import {
  Badge,
  Button,
  Form,
  Image,
  Input,
  Select,
  Popconfirm,
  Table,
  message,
} from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import './index.css';
import { ColumnsType } from 'antd/es/table';
import { useForm } from 'antd/es/form/Form';
import { deleteGoods, searchGoodsList } from '../../interfaces/interfaces';
import { CreateModal } from './CreateModal';
import { UpdateModal } from './UpdateModal';
import { goodsTypeList } from '../../const/goodsType';
import { CategorySelect } from '../Category/CategorySelect';
import { BASE_URL, DEFAULT_IMAGE } from '../../const/base';

interface SearchGoods {
  name: string;
  // id: number;
  kind: number;
}

export interface GoodsManageResult {
  id: number;
  name: string;
  kind: number;
  img: string;
  sellPrice: string;
  description: string;
  isSale: boolean;
  createTime: Date;
  updateTime: Date;
}

export function GoodsManage() {
  const [pageNo, setPageNo] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [goodsList, setGoodsList] = useState<Array<GoodsManageResult>>([]);
  const [total, setTotal] = useState<number>(0);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [updateId, setUpdateId] = useState<number>();
  const [refresh, setRefresh] = useState(true);

  const columns: ColumnsType<GoodsManageResult> = useMemo(
    () => [
      {
        title: '商品 ID',
        dataIndex: 'id',
      },
      {
        title: '商品名称',
        dataIndex: 'name',
      },
      {
        title: '商品类型',
        dataIndex: 'kind',
        render: (_, record) => {
          return <CategorySelect value={record.kind} isText={true} />;
        },
      },
      {
        title: '商品图片',
        dataIndex: 'img',
        render: (_, record) => (
          <div>
            <Image width={100} src={BASE_URL + (record.img || DEFAULT_IMAGE)} />
          </div>
        ),
      },
      {
        title: '商品售价',
        dataIndex: 'sellPrice',
      },
      {
        title: '描述',
        dataIndex: 'description',
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
        title: '上架状态',
        dataIndex: 'isSale',
        render: (_, record) =>
          record.isSale ? (
            <Badge status="error">已上架</Badge>
          ) : (
            <Badge status="success">未上架</Badge>
          ),
      },
      {
        title: '操作',
        render: (_, record) => (
          <div>
            <Popconfirm
              title="商品删除"
              description="确认删除吗？"
              onConfirm={() => handleDelete(record.id)}
            >
              <Button type="primary" danger size="small">
                删除
              </Button>
            </Popconfirm>
            <Button
              type="primary"
              size="small"
              style={{ marginTop: '10px' }}
              onClick={() => {
                setIsUpdateModalOpen(true);
                setUpdateId(record.id);
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

  const handleDelete = useCallback(async (id: number) => {
    try {
      await deleteGoods(id);
      message.success('删除成功');
      setRefresh(true);
    } catch (e) {
      console.log(e);
      message.error('删除失败');
    }
  }, []);

  const searchGoods = async (values: SearchGoods, initPage?: number) => {
    const res = await searchGoodsList(
      values.name,
      // values.id,
      values.kind,
      initPage ? 1 : pageNo,
      pageSize
    );

    const { data } = res.data;
    if (res.status === 201 || res.status === 200) {
      setGoodsList(
        data.goods.map((item: GoodsManageResult) => {
          return {
            key: item.id,
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

  const [form] = useForm<SearchGoods>();

  useEffect(() => {
    setRefresh(true);
  }, [pageNo, pageSize]);

  useEffect(() => {
    if (refresh === true) {
      searchGoods({
        name: form.getFieldValue('name'),
        kind: form.getFieldValue('kind'),
      });
    }
  }, [refresh]);

  const changePage = useCallback(function (pageNo: number, pageSize: number) {
    setPageNo(pageNo);
    setPageSize(pageSize);
  }, []);

  return (
    <div id="goodsManage-container">
      <div className="goodsManage-form">
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
          <Form.Item label="商品名称" name="name">
            <Input />
          </Form.Item>

          {/* <Form.Item label="商品ID" name="id">
            <Input />
          </Form.Item> */}

          <Form.Item label="商品类型" name="kind" style={{ width: 200 }}>
            <CategorySelect />
          </Form.Item>

          {/* <Form.Item label="货架位置" name="location">
            <Input />
          </Form.Item> */}

          <Form.Item label=" ">
            <Button htmlType="submit">搜索</Button>
            <Button type="primary" onClick={() => setIsCreateModalOpen(true)}>
              添加
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div className="goodsManage-table">
        <Table
          columns={columns}
          dataSource={goodsList}
          pagination={{
            current: pageNo,
            pageSize: pageSize,
            onChange: changePage,
            total,
          }}
        />
      </div>
      <CreateModal
        isOpen={isCreateModalOpen}
        handleClose={() => {
          setIsCreateModalOpen(false);
          setPageNo(1);
          setRefresh(true);
        }}
      ></CreateModal>
      <UpdateModal
        id={updateId!}
        isOpen={isUpdateModalOpen}
        handleClose={() => {
          setIsUpdateModalOpen(false);
          setPageNo(1);
          setRefresh(true);
        }}
      ></UpdateModal>
    </div>
  );
}
