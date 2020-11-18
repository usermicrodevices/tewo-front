import React, { useState, useRef } from 'react';
import { inject, observer } from 'mobx-react';
import {
  Card, InputNumber, Button, Popconfirm,
} from 'antd';
import { SendOutlined, StopOutlined, DeleteOutlined } from '@ant-design/icons';

import Typography from 'elements/typography';
import Icon from 'elements/icon';
import Loader from 'elements/loader';

import NotificationRow from 'components/notifications/row';

import styles from './style.module.scss';

const DelayInterval = observer(({ delay }) => {
  const [editable, setEditable] = useState(false);
  const [value, setValue] = useState(0);
  const ref = useRef(null);
  const hasInterval = delay.interval !== null;

  const intervalText = hasInterval ? `${delay.minutes} мин.` : 'установить';

  const onClick = () => {
    setEditable(true);

    setValue(delay.minutes);

    setTimeout(() => {
      ref.current.focus();
    }, 150);
  };

  const onSave = () => {
    delay.setInterval(value < 0 ? 0 : value * 60);

    setEditable(false);
  };

  const onDelete = () => {
    delay.setInterval(null);

    setEditable(false);
  };

  const onCancel = () => {
    setEditable(false);
  };

  const onChange = (targetValue) => {
    setValue(targetValue);
  };

  return (
    <div className={styles.interval}>
      <div className={styles.clock} onClick={onClick} aria-hidden="true">
        <Icon size={16} name="clock-outline" className={styles.clockicon} />
        {editable ? (
          <InputNumber min={0} className={styles.input} value={value} type="number" onChange={onChange} ref={ref} />
        ) : <Typography.Text>{intervalText}</Typography.Text>}
      </div>
      {editable && (
        <div className={styles.actions}>
          <Popconfirm
            title={`Сбросить время оповещения для "${delay.name}"?`}
            onConfirm={onDelete}
            okText="Да"
            cancelText="Нет"
          >
            <Button
              icon={<DeleteOutlined fill="#2979BD" />}
              type="text"
              title="Удалить"
            />
          </Popconfirm>
          <Button
            icon={<StopOutlined fill="#2979BD" />}
            type="text"
            onClick={onCancel}
            title="Отменить"
          />
          <Button
            icon={<SendOutlined fill="#2979BD" />}
            type="text"
            onClick={onSave}
            title="Сохранить"
          />
        </div>
      )}
    </div>
  );
});

const NotificationDelay = observer(({ delay }) => {
  const gridTemplateColumns = '4fr 2fr 1fr';

  return (
    <NotificationRow className={styles.row} style={{ gridTemplateColumns }}>
      <Typography.Title level={4}>{delay.name}</Typography.Title>
      <DelayInterval delay={delay} />
    </NotificationRow>
  );
});

function NotificationsDelayList({ session }) {
  const { personalNotifications } = session;
  const { notificationDelays } = personalNotifications;

  return (
    <Card>
      <header className={styles.cardHeader}>
        <Typography.Title level={3}>Список событий</Typography.Title>
        <Typography.Caption type="secondary">Установите время, через которое требуется иницировать отправку оповещения.</Typography.Caption>
      </header>

      {notificationDelays.length
        ? (
          <div className={styles.table}>
            {notificationDelays.map((delay) => (
              <NotificationDelay delay={delay} />
            ))}
          </div>
        )
        : <Loader />}
    </Card>
  );
}

export default inject('session')(observer(NotificationsDelayList));
