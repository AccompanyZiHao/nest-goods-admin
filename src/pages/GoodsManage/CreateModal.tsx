import { Select, Form, Input, InputNumber, Modal, message } from 'antd';
import { useForm } from 'antd/es/form/Form';
import TextArea from 'antd/es/input/TextArea';
import { useCallback } from 'react';

import { Upload } from './../../components/Upload';

import { createGoods } from '../../interfaces/interfaces';
import { FormLayout } from './../../const/form';
import { goodsTypeList } from '../../const/goodsType';
import { CategorySelect } from '../Category/CategorySelect';

export interface CreateModalProps {
  isOpen: boolean;
  handleClose: Function;
}

export interface CreateGoodsForm {
  name: string;
  num: number;
  img: string;
  purchasePrice: number;
  sellPrice: number;
  kind: number;
  description: string;
}

export function CreateModal(props: CreateModalProps) {
  const [form] = useForm<CreateGoodsForm>();

  const handleOk = useCallback(function () {
    form
      .validateFields()
      .then(async (values) => {
        values.description = values.description || '';

        const res = await createGoods(values);

        if (res.status === 201 || res.status === 200) {
          message.success('新增成功');
          form.resetFields();
          props.handleClose();
        } else {
          message.error(res.data.data);
        }
      })
      .catch((res) => {
        console.log('error', res);
      });
  }, []);

  return (
    <Modal
      title="新增商品"
      open={props.isOpen}
      onOk={handleOk}
      onCancel={() => props.handleClose()}
    >
      <Form form={form} colon={false} {...FormLayout}>
        <Form.Item
          label="商品名称"
          name="name"
          validateTrigger="onBlur"
          rules={[{ required: true, message: '请输入商品名称!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="商品数量"
          name="num"
          validateTrigger="onBlur"
          rules={[{ required: true, message: '请输入商品数量!' }]}
        >
          <InputNumber />
        </Form.Item>
        <Form.Item
          label="商品进价"
          name="purchasePrice"
          validateTrigger="onBlur"
          rules={[{ required: true, message: '请输入商品进价!' }]}
        >
          <InputNumber />
        </Form.Item>
        <Form.Item
          label="商品售价"
          name="sellPrice"
          validateTrigger="onBlur"
          rules={[{ required: true, message: '请输入商品售价!' }]}
        >
          <InputNumber />
        </Form.Item>
        <Form.Item
          label="商品图片"
          name="img"
          validateTrigger="onBlur"
          rules={[{ required: true, message: '请上传商品图片!' }]}
          shouldUpdate
        >
          <Upload />
        </Form.Item>
        <Form.Item
          label="商品类型"
          name="kind"
          validateTrigger="onBlur"
          rules={[{ required: true, message: '请选择商品类型!' }]}
        >
          <CategorySelect />
        </Form.Item>
        <Form.Item label="描述" name="description">
          <TextArea />
        </Form.Item>
      </Form>
    </Modal>
  );
}
