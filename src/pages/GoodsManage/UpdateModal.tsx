import { Select, Form, Input, InputNumber, Modal, message } from 'antd';
import { useForm } from 'antd/es/form/Form';
import TextArea from 'antd/es/input/TextArea';
import { useCallback, useEffect } from 'react';

import { Upload } from './../../components/Upload';

import type { CreateGoodsForm, CreateModalProps } from './CreateModal';

import { FormLayout } from './../../const/form';
import { findGoods, updateGoods } from '../../interfaces/interfaces';
import { goodsTypeList } from '../../const/goodsType';
import { CategorySelect } from '../Category/CategorySelect';

interface UpdateGoodsModalProps extends CreateModalProps {
  id: number;
}

export interface UpdateGoodsForm extends CreateGoodsForm {
  id: number;
}

export function UpdateModal(props: UpdateGoodsModalProps) {
  const [form] = useForm<UpdateGoodsForm>();

  const handleOk = useCallback(async function () {
    const values = form.getFieldsValue();

    values.description = values.description || '';

    const res = await updateGoods({
      ...values,
      id: form.getFieldValue('id'),
    });

    if (res.status === 201 || res.status === 200) {
      message.success('更新成功');
      props.handleClose();
    } else {
      message.error(res.data.data);
    }
  }, []);

  useEffect(() => {
    async function query(id: number) {
      const res = await findGoods(id);

      const { data } = res;
      if (res.status === 200 || res.status === 201) {
        form.setFieldValue('id', data.data.id);
        form.setFieldValue('name', data.data.name);
        form.setFieldValue('kind', data.data.kind);
        form.setFieldValue('img', data.data.img);
        form.setFieldValue('purchasePrice', data.data.purchasePrice);
        form.setFieldValue('num', data.data.num);
        form.setFieldValue('sellPrice', data.data.sellPrice);
        form.setFieldValue('description', data.data.description);
      } else {
        message.error(res.data.data);
      }
    }

    if (props.id) {
      query(props.id);
    }
  }, [form, props.id]);

  return (
    <Modal
      title="更新商品"
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
