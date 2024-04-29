import { Modal } from 'antd';

const { confirm } = Modal;

export const showConfirm = (
  {
    title = '提示',
    content = '',
  }: {
    title?: string;
    content: string;
  },
  callback: () => void
) => {
  confirm({
    title,
    content: <div>{content}</div>,
    onOk() {
      callback();
    },
  });
};
