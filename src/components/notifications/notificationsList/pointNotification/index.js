import React, { useState } from 'react';
import { observer } from 'mobx-react';
import { Checkbox } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';

import Typography from 'elements/typography';

import NotificationRow from 'components/notifications/row';

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

const CollapseIcon = ({ opened = false }) => (opened ? <UpOutlined size={32} /> : <DownOutlined size={32} />);

const SalePointNotification = observer(({ salePointNotification }) => {
  const [opened, setOpened] = useState(false);
  const { name, notifications, config: { types } } = salePointNotification;

  const gridTemplateColumns = `4fr ${types.map((_) => '1fr').join(' ')} 50px`;

  const headerElement = (
    <NotificationRow className={styles.header} style={{ gridTemplateColumns }} onClick={() => setOpened(!opened)}>
      <Typography.Title level={4}>{name}</Typography.Title>
      {types.map((type) => (
        <NotificationCheckbox
          key={type.id}
          id={type.id}
          notification={salePointNotification}
          label={`Все ${type.value}`}
        />
      ))}
      <CollapseIcon opened={opened} />
    </NotificationRow>
  );

  const contentElement = opened ? notifications.map((row) => (
    <NotificationRow key={row.id} className={styles.row} style={{ gridTemplateColumns }}>
      <Typography.Text>{row.name}</Typography.Text>
      {types.map((type) => (
        <NotificationCheckbox
          key={type.id}
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

export default SalePointNotification;
