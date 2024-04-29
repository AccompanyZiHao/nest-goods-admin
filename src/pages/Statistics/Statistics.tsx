import { Button, DatePicker, Form, Select, message } from 'antd';
import './statistics.css';
import * as echarts from 'echarts';
import { useEffect, useRef, useState } from 'react';
import { goodsUsedCount, userShelfRequestCount } from '../../interfaces/interfaces';
import dayjs from 'dayjs';
import { useForm } from 'antd/es/form/Form';

interface UserShelfRequestData {
  userId: string;
  userName: string;
  count: string;
}
interface MeetingRoomUsedData {
  goodsName: string;
  goodsId: number;
  count: string;
}

export function Statistics() {
  // 用户申请上下架统计数据
  const [userShelfRequestData, setUserShelfRequestData] = useState<Array<UserShelfRequestData>>();
  // echarts dom ref
  const containerRef = useRef<HTMLDivElement>(null);

  // 商品被上下架的统计数据
  const [goodsUsedData, setGoodsUsedData] = useState<Array<MeetingRoomUsedData>>();
  // echarts dom ref
  const containerRef2 = useRef<HTMLDivElement>(null);

  async function getStatisticData(values: { startTime: string; endTime: string }) {
    const startTime = dayjs(values.startTime).format('YYYY-MM-DD');
    const endTime = dayjs(values.endTime).format('YYYY-MM-DD');

    const res = await userShelfRequestCount(startTime, endTime);

    const { data } = res.data;
    if (res.status === 201 || res.status === 200) {
      console.log('data==', data);

      setUserShelfRequestData(data);
    } else {
      message.error(data || '系统繁忙，请稍后再试');
    }

    const res2 = await goodsUsedCount(startTime, endTime);

    const { data: data2 } = res2.data;
    if (res2.status === 201 || res2.status === 200) {
      setGoodsUsedData(data2);
    } else {
      message.error(data2 || '系统繁忙，请稍后再试');
    }
  }

  useEffect(() => {
    const myChart = echarts.init(containerRef.current);

    if (!userShelfRequestData) {
      return;
    }

    myChart.setOption({
      title: {
        text: '用户上下架统计',
      },
      tooltip: {},
      xAxis: {
        data: userShelfRequestData?.map((item) => item.userName),
      },
      yAxis: {},
      series: [
        {
          name: '上下架次数',
          type: form.getFieldValue('chartType'),
          data: userShelfRequestData?.map((item) => {
            return {
              name: item.userName,
              value: item.count,
            };
          }),
        },
      ],
    });
  }, [userShelfRequestData]);

  useEffect(() => {
    const myChart = echarts.init(containerRef2.current);

    if (!goodsUsedData) {
      return;
    }

    myChart.setOption({
      title: {
        text: '商品被上下架统计',
      },
      tooltip: {},
      xAxis: {
        data: goodsUsedData?.map((item) => item.goodsName),
      },
      yAxis: {},
      series: [
        {
          name: '上下架次数',
          type: form.getFieldValue('chartType'),
          data: goodsUsedData?.map((item) => {
            return {
              name: item.goodsName,
              value: item.count,
            };
          }),
        },
      ],
    });
  }, [goodsUsedData]);

  const [form] = useForm();

  return (
    <div id="statistics-container">
      <div className="statistics-form">
        <Form form={form} onFinish={getStatisticData} name="search" layout="inline" colon={false}>
          <Form.Item label="开始日期" name="startTime">
            <DatePicker />
          </Form.Item>

          <Form.Item label="结束日期" name="endTime">
            <DatePicker />
          </Form.Item>

          <Form.Item label="图表类型" name="chartType" initialValue={'bar'}>
            <Select>
              <Select.Option value="pie">饼图</Select.Option>
              <Select.Option value="bar">柱形图</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div className="dsf">
        <div className="statistics-chart" ref={containerRef}></div>
        <div className="statistics-chart" ref={containerRef2}></div>
      </div>
    </div>
  );
}
