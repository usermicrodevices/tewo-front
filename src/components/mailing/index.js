import React from 'react';
import { Card } from 'antd';

import Typography from 'elements/typography';

function MailingOverview({}) {
  return (
    <Card>
      <header>
        <Typography.Title level={3}>Список объектов и уведомлений</Typography.Title>
        <Typography.Caption type="secondary">Выберите объекты по которым вы хотите рассылать уведомления</Typography.Caption>
      </header>
      <section>
        Rows
      </section>
    </Card>
  );
}

export default MailingOverview;
