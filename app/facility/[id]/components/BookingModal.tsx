'use client';

import { DatePicker, Form, Modal, notification, TimePicker } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import request from 'app/lib/request';
import { Dayjs } from 'dayjs';
import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';

const Inputs = styled(Form.Item)`
  .ant-form-item-control-input-content {
    display: flex;
    gap: 8px;
  }
`;

interface Props {
  className?: string;
  from?: Dayjs;
  to?: Dayjs;
  data?: FacilityItem;
  opened: boolean;
  onClose(): void;
}

type FormValues = {
  date: Dayjs;
  from: Dayjs;
  to: Dayjs;
};
export function BookingModal({ onClose, ...props }: Props) {
  const [form] = useForm<FormValues>();
  const [loading, setLoading] = useState(false);
  const [api, contextHolder] = notification.useNotification();

  const onSubmit = useCallback(
    async (values: FormValues) => {
      try {
        setLoading(true);

        const date = values.date
          .clone()
          .set('hour', 0)
          .set('minute', 0)
          .set('second', 0);

        const resp = await request('/api/facility/reserve', {
          method: 'POST',
          body: JSON.stringify({
            facilityId: props.data?.id,
            from: date
              .clone()
              .add(values.from.get('hour'), 'hour')
              .add(values.from.get('minute'), 'minute'),
            to: date
              .clone()
              .add(values.to.get('hour'), 'hour')
              .add(values.to.get('minute'), 'minute'),
            userEmail: 'kqthang1505@gmail.com',
          }),
        });

        api.success({
          message: `Reserve a slot on ${values.date.format(
            'DD MMM YYYY'
          )}, from ${values.from.format('HH:mm')} - to ${values.to.format(
            'HH:mm'
          )} successfully`,
          duration: 200,
        });
        onClose();
      } catch (e: RequestError) {
        console.log('e', e);
        api.error({ message: e.message });
      } finally {
        setLoading(false);
      }
    },
    [onClose, props.data?.id, api]
  );

  const handleOK = useCallback(() => {
    form.submit();
  }, [form]);

  useEffect(() => {
    if (props.opened)
      form.setFieldsValue({ from: props.from, to: props.to, date: props.from });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.opened]);

  return (
    <>
      {contextHolder}
      <Modal
        open={props.opened}
        onCancel={onClose}
        title={`Booking this slot of ${props.data?.name}`}
        okText="Book"
        destroyOnClose
        onOk={handleOK}
        okButtonProps={{ loading }}
      >
        <Form
          form={form}
          initialValues={{
            from: props.from,
            to: props.to,
            date: props.from,
          }}
          layout="vertical"
          onFinish={onSubmit}
        >
          <Inputs label="Date" style={{ gap: 8 }}>
            <Form.Item name="date" noStyle rules={[{ required: true }]}>
              <DatePicker showToday={false} />
            </Form.Item>
            <Form.Item name="from" noStyle rules={[{ required: true }]}>
              <TimePicker showSecond={false} format="HH:mm" showNow={false} />
            </Form.Item>
            <Form.Item name="to" noStyle rules={[{ required: true }]}>
              <TimePicker
                showSecond={false}
                format="HH:mm"
                showNow={false}
                use12Hours={false}
              />
            </Form.Item>
          </Inputs>
        </Form>
      </Modal>
    </>
  );
}