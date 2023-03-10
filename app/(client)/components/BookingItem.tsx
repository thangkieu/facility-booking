'use client';

import { Button, Card, Typography } from 'antd';
import dayjs from 'dayjs';
import Image from 'next/image';
import { useCallback } from 'react';
import styled from 'styled-components';

import { EditOutlined } from '@ant-design/icons';

const CardStyle = styled(Card)`
  height: 100%;
  display: flex;
  flex-direction: column;

  .ant-card-actions {
    margin-top: auto;
  }
`;

interface Props {
  data: BookingItem;
  onCancel?(data?: BookingItem): void;
  onEdit?(data?: BookingItem): void;
}

export function BookingItem({ onCancel, onEdit, ...props }: Props) {
  const handleCancel = useCallback(() => {
    onCancel?.(props.data);
  }, [onCancel, props.data]);

  const handleEdit = useCallback(() => {
    onEdit?.(props.data);
  }, [onEdit, props.data]);

  return (
    <>
      <CardStyle
        size="small"
        cover={
          props.data.facility?.thumbnail ? (
            <Image
              alt={props.data.facility.name}
              src={props.data.facility?.thumbnail}
              width={100}
              height={100}
            />
          ) : null
        }
        actions={[
          <Button
            data-testid="booking-cancel-btn"
            key="details"
            type="text"
            size="small"
            danger
            onClick={handleCancel}
          >
            Cancel
          </Button>,
          <Button
            data-testid="booking-edit-btn"
            icon={<EditOutlined />}
            type="text"
            size="small"
            key="edit"
            onClick={handleEdit}
          >
            Edit
          </Button>,
        ]}
      >
        <Typography.Title level={5}>
          {props.data.facility?.name}
        </Typography.Title>
        <Typography.Text ellipsis>{`From: ${dayjs(props.data.from).format(
          'DD/MM/YYYY HH:mm'
        )}`}</Typography.Text>
        <Typography.Text ellipsis>{`To: ${dayjs(props.data.to).format(
          'DD/MM/YYYY HH:mm'
        )}`}</Typography.Text>
      </CardStyle>
    </>
  );
}
