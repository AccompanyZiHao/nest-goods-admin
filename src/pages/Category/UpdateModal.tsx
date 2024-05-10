import { Form, Input, message, Modal } from 'antd';
import { FormLayout } from '../../const/form';
import { updateCategory } from '../../interfaces/interfaces';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'antd/es/form/Form';
import { CategoryResult, SearchCategory } from '.';
import { CreateCategoryModalProps } from './CreateModal';

interface UpdateModalProps extends CreateCategoryModalProps {
  row: CategoryResult;
}
export interface UpdateCategoryForm extends SearchCategory {
  category_id: number;
}
export function UpdateCategoryModal(props: UpdateModalProps) {
  const [form] = useForm<UpdateCategoryForm>();

  const [categoryId, setCategoryId] = useState<number>(0);

  // 编辑
  const handleOk = () => {
    form
      .validateFields()
      .then(async (values) => {
        const res = await updateCategory({
          ...values,
          category_id: categoryId,
        });
        if (res.status === 201 || res.status === 200) {
          message.success('修改成功');
          form.resetFields();
          props.handleClose();
        } else {
          message.error(res.data.data);
        }
      })
      .catch((res) => {
        console.log('error', res);
      });
  };

  // 弹窗数据回显
  useEffect(() => {
    if (props.isOpen && props.row && props.row.category_id) {
      form.setFieldValue('category_name', props.row.category_name);
      const id = props.row.category_id;

      setCategoryId(id);
    }
  }, [props.isOpen, props.row]);

  return (
    <Modal
      title="编辑类型"
      open={props.isOpen}
      onOk={handleOk}
      onCancel={() => props.handleClose()}
    >
      <Form form={form} colon={false} {...FormLayout}>
        <Form.Item
          label="类型名称"
          name="category_name"
          validateTrigger="onBlur"
          rules={[{ required: true, message: '请输入类型名称!' }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}
