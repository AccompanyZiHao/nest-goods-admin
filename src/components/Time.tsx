import dayjs from 'dayjs';

export const TimeColumn = (title, dataIndex) => {
  return {
    title,
    dataIndex,
    render(_, record) {
      return dayjs(new Date(record.createTime)).format('YYYY-MM-DD HH:mm:ss');
    },
  };
};

export const CreateTimeColumn = TimeColumn('添加时间', 'createTime');
export const UpdateTimeColumn = TimeColumn('上次更新时间', 'updateTime');
export const RegisterTimeColum = TimeColumn('注册时间', 'createTime');
