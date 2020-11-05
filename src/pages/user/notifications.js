import React from 'react';

import SubPage from 'elements/subpage';
import Typography from 'elements/typography';
import { Card } from 'antd';

const Notifications = () => (
  <SubPage
    menu={[
      {
        path: '',
        text: 'Список объектов',
        widget: () => <Card>xxx</Card>,
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
