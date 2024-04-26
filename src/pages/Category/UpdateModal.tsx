import { Form, Input, message, Modal } from 'antd';
import { FormLayout } from '../../const/form';
import { updateCategory } from '../../interfaces/interfaces';
import { useCallback, useEffect } from 'react';
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

  // 编辑
  const handleOk = useCallback(() => {
    form.validateFields().then(async (values) => {
      const res = await updateCategory({
        ...values,
        category_id: props.row.category_id,
      });
      if (res.status === 201 || res.status === 200) {
        message.success('新增成功');
        form.resetFields();
        props.handleClose();
      } else {
        message.error(res.data.data);
      }
    });
  }, []);

  // 弹窗数据回显
  useEffect(() => {
    if (props.isOpen && props.row?.category_id) {
      form.setFieldValue('category_name', props.row.category_name);
      form.setFieldValue('category_id', props.row.category_id);
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
