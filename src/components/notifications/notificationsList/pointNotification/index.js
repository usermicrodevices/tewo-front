import React from 'react';
import { observer } from 'mobx-react';
import { Checkbox } from 'antd';

import Typography from 'elements/typography';
import { Row } from 'elements/collapse';

import styles from './style.module.scss';

const NotificationCheckbox = observer(({ id, notification, label }) => (
  <Checkbox
    key={id}
    name={id}
    checked={notification.types[id]}
    indeterminate={notification.types[id] === null}
    onClick={(e) => e.stopPropagation()}
    onChange={notification.onChange}
  >
    {label}
  </Checkbox>
));

export const PointNotificationContent = observer(({ salePointNotification }) => {
  const { notifications, config: { types } } = salePointNotification;
  const gridTemplateColumns = `4fr ${types.map((_) => '1fr').join(' ')}`;

  return (
    <div className={styles.content}>
      {notifications.map((row) => (
        <Row key={row.id} className={styles.row} style={{ gridTemplateColumns }}>
          <Typography.Text>{row.name}</Typography.Text>
          {types.map((type) => (
            <NotificationCheckbox
              key={type.id}
              id={type.id}
              notification={row}
              label={type.value}
            />
          ))}
        </Row>
      ))}
    </div>
  );
});

export const PointNotificationHeader = observer(({ salePointNotification }) => {
  const { name, config: { types } } = salePointNotification;
  const gridTemplateColumns = `4fr ${types.map((_) => '1fr').join(' ')}`;

  return (
    <div style={{ gridTemplateColumns }} className={styles.header}>
      <Typography.Title level={4}>{name}</Typography.Title>
      {types.map((type) => (
        <NotificationCheckbox
          key={type.id}
          id={type.id}
          notification={salePointNotification}
          label={`Все ${type.value}`}
        />
      ))}
    </div>
  );
});
