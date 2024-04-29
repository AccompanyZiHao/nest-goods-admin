import { Form, Input, message, Modal } from 'antd';
import { FormLayout } from '../../const/form';
import { createCategory } from '../../interfaces/interfaces';
import { useCallback } from 'react';
import { useForm } from 'antd/es/form/Form';
import { SearchCategory } from '.';
import { clearSessionStorage } from './CategorySelect';

export interface CreateCategoryModalProps {
  isOpen: boolean;
  handleClose: Function;
}
export function CreateCategoryModal(props: CreateCategoryModalProps) {
  const [form] = useForm<SearchCategory>();

  // 新增
  const handleOk = useCallback(() => {
    form.validateFields().then(async (values) => {
      const res = await createCategory(values);
      if (res.status === 201 || res.status === 200) {
        message.success('新增成功');

        clearSessionStorage();

        form.resetFields();
        props.handleClose();
      } else {
        message.error(res.data.data);
      }
    });
  }, []);
  return (
    <Modal title="新增类型" open={props.isOpen} onOk={handleOk} onCancel={() => props.handleClose()}>
      <Form form={form} colon={false} {...FormLayout}>
        <Form.Item
          label="类型名称"
          name="categoryName"
          validateTrigger="onBlur"
          rules={[{ required: true, message: '请输入类型名称!' }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}
