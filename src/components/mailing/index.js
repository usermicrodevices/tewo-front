import React from 'react';
import { Card, Select } from 'antd';
import { observer, inject } from 'mobx-react';

import Typography from 'elements/typography';
import { Collapse } from 'elements/collapse';
import Loader from 'elements/loader';

import { PointNotificationContent, PointNotificationHeader } from './pointNotification';

import styles from './style.module.scss';

const MailingsList = observer(({ mailings, setNotification }) => (
  <Collapse className={styles.content}>
    {
        mailings === undefined
          ? <Loader />
          : mailings.map((point) => (
            <Collapse.Panel
              key={point.id}
              header={<PointNotificationHeader point={point} />}
            >
              <PointNotificationContent point={point} onChange={(notificationId, checked) => setNotification(point.id, notificationId, checked)} />
            </Collapse.Panel>
          ))
      }
  </Collapse>
));

const MailingsHeader = observer(({ element }) => (
  <header>
    <Typography.Title level={3}>Список объектов и уведомлений</Typography.Title>
    <Typography.Caption type="secondary">Выберите объекты и уведомления, по которым вы хотите проводить расслыку</Typography.Caption>
    <section>
      <Select
        mode="tags"
        placeholder="Введите список почт для рассылки"
        value={element.emails}
        className={styles.emails}
        onChange={element.setEmails}
      >
        {element.emails.map((email) => <Select.Option key={email} value={email}>{email}</Select.Option>)}
      </Select>
    </section>
  </header>
));

function MailingOverview({ element }) {
  return (
    <Card>
      <MailingsHeader element={element} />
      <MailingsList
        mailings={element.pointsNotifications}
        setNotification={element.setNotification}
      />
    </Card>
  );
}

export default inject('element')(observer(MailingOverview));
