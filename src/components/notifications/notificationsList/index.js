import React from 'react';
import { Card } from 'antd';

import Typography from 'elements/typography';

function NotificationsList() {
  return (
    <Card>
      <header>
        <div>
          <Typography.Title level={3}>Список объектов и событий</Typography.Title>
          <Typography.Caption>Выберите объекты по которым вы хотите получать уведомления</Typography.Caption>
        </div>
        <div>
          <div>
            Search
          </div>
          <div>
            Массовое редактирование
          </div>
        </div>

      </header>
      <div className="table" />
    </Card>
  );
}

export default NotificationsList;
