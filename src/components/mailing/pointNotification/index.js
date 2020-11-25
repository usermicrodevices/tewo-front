import React from 'react';
import { observer } from 'mobx-react';
import { Checkbox } from 'antd';

import Typography from 'elements/typography';
import { Row } from 'elements/collapse';

import styles from './style.module.scss';

export const PointNotificationContent = observer(({ point, onChange }) => {
  const { notifications } = point;

  return (
    <div className={styles.content}>
      {notifications.map((notification) => (
        <Row key={notification.id} className={styles.row}>
          <Checkbox
            key={notification.id}
            name={notification.id}
            checked={notification.enabled}
            onChange={(e) => onChange(notification.id, e.target.checked)}
          >
            {notification.name}
          </Checkbox>
        </Row>
      ))}
    </div>
  );
});

export const PointNotificationHeader = observer(({ point }) => {
  const { name, allCount, enabledCount } = point;
  const title = `${name}`;
  const caption = `${enabledCount}/${allCount}`;

  return (
    <div className={styles.header}>
      <Typography.Title level={4} className={styles.title}>{title}</Typography.Title>
      <Typography.Text type={enabledCount > 0 ? 'primary' : 'secondary'}>{caption}</Typography.Text>
    </div>
  );
});
