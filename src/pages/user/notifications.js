import React from 'react';
import { Card } from 'antd';

import SubPage from 'elements/subpage';
import Typography from 'elements/typography';

import NotificationsList from 'components/notifications/notificationsList';

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
        widget: () => <Card>yyy</Card>,
      },
    ]}
    title={(
      <>
        <Typography.Title level={1}>
          Персональные уведомления
        </Typography.Title>
        <div>Для работы push-уведомлений требуется Предоставить разрешение</div>
      </>
    )}
  />
);

export default Notifications;
