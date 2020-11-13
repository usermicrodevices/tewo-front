import React, { useState } from 'react';
import { inject, observer } from 'mobx-react';
import { Card, Checkbox } from 'antd';

import Typography from 'elements/typography';

import NotificationRow from 'components/notifications/row';

import styles from './style.module.scss';

const NotificationCheckbox = observer(({ id, notification, label }) => (
  <Checkbox key={id} checked={notification.types[id]} name={id} onChange={notification.onChange}>
    {label}
  </Checkbox>
));

const SalePointNotification = observer(({
  id, columns, salePointNotification,
}) => {
  const [opened, setOpened] = useState(false);
  const { name, notifications } = salePointNotification;

  const gridTemplateColumns = `4fr ${columns.map((_) => '1fr').join(' ')} 50px`;

  const headerElement = (
    <NotificationRow className={styles.header} style={{ gridTemplateColumns }}>
      <Typography.Title level={4}>{name}</Typography.Title>
      {columns.map((type) => (
        <NotificationCheckbox
          id={type.id}
          notification={salePointNotification}
          label={`Все ${type.value}`}
        />
      ))}
      <button type="button" onClick={() => setOpened(!opened)}>Open</button>
    </NotificationRow>
  );

  const contentElement = opened ? notifications.map((row) => (
    <NotificationRow className={styles.row} style={{ gridTemplateColumns }}>
      <Typography.Title level={4}>{row.name}</Typography.Title>
      {columns.map((type) => (
        <NotificationCheckbox
          id={type.id}
          notification={row}
          label={type.value}
        />
      ))}
    </NotificationRow>
  )) : null;

  return (
    <div className={styles.collapse}>
      {headerElement}
      <div className={styles.content}>
        {contentElement}
      </div>
    </div>
  );
});

function NotificationsList({ session }) {
  const { personalNotifications } = session;

  const divElement = (
    personalNotifications.tableData.map((salePointNotification) => (
      <SalePointNotification
        key={salePointNotification.id}
        columns={personalNotifications.types}
        salePointNotification={salePointNotification}
      />
    ))
  );

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
      <div className="table">
        {divElement}
      </div>
    </Card>
  );
}

export default inject('session')(observer(NotificationsList));
