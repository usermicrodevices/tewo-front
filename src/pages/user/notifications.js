import React from 'react';

import SubPage from 'elements/subpage';
import Typography from 'elements/typography';

import NotificationsList from 'components/notifications/notificationsList';
import NotificationsDelayList from 'components/notifications/notificationsDelayList';

const Notifications = () => (
  <SubPage
    menu={[
      {
        path: '',
        text: 'Уведомления по объектам',
        widget: () => <NotificationsList />,
      },
      {
        path: 'alert_time',
        text: 'Время оповещения',
        widget: () => <NotificationsDelayList />,
      },
    ]}
    title={(
      <>
        <Typography.Title level={1}>
          Персональные уведомления
        </Typography.Title>
      </>
    )}
  />
);

export default Notifications;
