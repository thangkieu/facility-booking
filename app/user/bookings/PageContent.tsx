'use client';

import { Divider, Modal, notification, Typography } from 'antd';
import request from 'app/(client)/lib/request';
import { BookingModal } from 'app/facility/[id]/components/BookingModal';
import dayjs from 'dayjs';
import { memo, useCallback, useState } from 'react';

import { ExclamationCircleFilled } from '@ant-design/icons';
import { BookingList } from '@components/BookingList';
import { FacilityTypeEnum } from '@enums';

import styles from './page.module.css';

interface Props {
  bookedRooms: BookingItem[];
  bookedFacilities: BookingItem[];
}
export const PageContent = memo<Props>(function PageContent(props) {
  const [rooms, setRooms] = useState(props.bookedRooms);
  const [facilities, setFacilities] = useState(props.bookedFacilities);
  const [api, contextHandler] = notification.useNotification();

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingBooking, setEditingBooking] = useState<BookingItem>();

  const cancelBooking = useCallback(
    async (data: BookingItem) => {
      try {
        await request(`/api/booking/cancel/${data.id}`);

        api.success({ message: 'Cancel booking successful' });

        switch (data.facility?.type) {
          case FacilityTypeEnum.Room:
            setRooms((rooms) => rooms.filter((r) => r.id !== data.id));
            break;
          case FacilityTypeEnum.Facility:
            setFacilities((facilities) =>
              facilities.filter((r) => r.id !== data.id)
            );
            break;
        }
      } catch (e: any) {
        console.log('error', e.message);
        api.error({ message: e.message });
      }
    },
    [api]
  );

  const handleCancelBooking = useCallback(
    (data: BookingItem) => {
      Modal.confirm({
        rootClassName: 'confirm-modal',
        title: `Cancel your booking`,
        icon: <ExclamationCircleFilled />,
        content: `Are you sure you want to cancel your booking of ${data.facility?.name}?`,
        okText: 'Yes',
        cancelText: 'No',
        cancelButtonProps: { className: 'confirm-modal-no-btn' },
        okButtonProps: { className: 'confirm-modal-yes-btn' },
        onOk: async () => await cancelBooking(data),
      });
    },
    [cancelBooking]
  );

  const handleCloseModal = useCallback(() => {
    setShowEditModal(false);
  }, []);

  const handleUpdated = useCallback(
    (data: BookingItem) => {
      switch (data.facility?.type) {
        case FacilityTypeEnum.Room:
          setRooms((rooms) => {
            const idx = rooms.findIndex((r) => r.id == data.id);
            rooms.splice(idx, 1, data);

            return rooms;
          });
          break;
        case FacilityTypeEnum.Facility:
          setFacilities((facilities) => {
            const idx = facilities.findIndex((r) => r.id == data.id);
            facilities.splice(idx, 1, data);

            return facilities;
          });
          break;
      }

      handleCloseModal();
    },
    [handleCloseModal]
  );

  const handleCancelled = useCallback(
    (bookingid: string) => {
      switch (editingBooking?.facility?.type) {
        case FacilityTypeEnum.Room:
          setRooms((rooms) => {
            return rooms.filter((b) => b.id !== bookingid);
          });
          break;
        case FacilityTypeEnum.Facility:
          setFacilities((facilities) => {
            return facilities.filter((b) => b.id !== bookingid);
          });
          break;
      }

      handleCloseModal();
    },
    [editingBooking?.facility?.type, handleCloseModal]
  );

  const handleEditBooking = useCallback((data: BookingItem) => {
    setEditingBooking(data);
    setShowEditModal(true);
  }, []);

  return (
    <>
      {contextHandler}
      <Typography.Title style={{ marginTop: 32 }} level={3}>
        Your Bookings
      </Typography.Title>

      <BookingList
        heading="Rooms"
        data={rooms}
        viewAllLink="/rooms"
        onCancel={handleCancelBooking}
        onEdit={handleEditBooking}
      />

      <Divider />

      <BookingList
        className={styles.list}
        heading="Facilities"
        data={facilities}
        viewAllLink="/facilities"
        onCancel={handleCancelBooking}
        onEdit={handleEditBooking}
      />

      <BookingModal
        opened={showEditModal}
        from={dayjs(editingBooking?.from)}
        to={dayjs(editingBooking?.to)}
        data={editingBooking?.facility}
        bookingId={editingBooking?.id}
        onClose={handleCloseModal}
        onDone={handleUpdated}
        onCancelled={handleCancelled}
        isUpdate
      />
    </>
  );
});
