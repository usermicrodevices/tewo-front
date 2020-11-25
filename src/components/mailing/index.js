import React from 'react';
import { Card } from 'antd';
import { observer, inject } from 'mobx-react';

import Typography from 'elements/typography';
import { Collapse } from 'elements/collapse';
import NoData from 'elements/noData';
import Loader from 'elements/loader';

import { PointNotificationContent, PointNotificationHeader } from './pointNotification';

import styles from './style.module.scss';

function MailingOverview({ element }) {
  const contentElement = element.pointsNotifications === undefined ? <Loader /> : (
    element.pointsNotifications.map((point) => (
      <Collapse.Panel
        key={point.id}
        header={<PointNotificationHeader point={point} />}
      >
        <PointNotificationContent point={point} onChange={(notificationId, checked) => element.setNotification(point.id, notificationId, checked)} />
      </Collapse.Panel>
    ))
  );

  return (
    <Card>
      <header>
        <Typography.Title level={3}>Список объектов и уведомлений</Typography.Title>
        <Typography.Caption type="secondary">Выберите объекты и уведомления, по которым вы хотите проводить расслыку</Typography.Caption>
        <section>
          Emails block
        </section>
      </header>

      <Collapse className={styles.content}>
        {contentElement}
      </Collapse>
    </Card>
  );
}

export default inject('element')(observer(MailingOverview));
