import React, { useState } from 'react';
import { inject, observer } from 'mobx-react';
import {
  Card, Checkbox, Input, Button, Modal, Table,
} from 'antd';
import {
  DownOutlined, UpOutlined, SearchOutlined, ProfileOutlined,
} from '@ant-design/icons';

import Typography from 'elements/typography';
import Loader from 'elements/loader';

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

const SalePointNotification = observer(({
  columns, salePointNotification, visible,
}) => {
  const [opened, setOpened] = useState(false);
  const { name, notifications } = salePointNotification;

  const gridTemplateColumns = `4fr ${columns.map((_) => '1fr').join(' ')} 50px`;
  const style = visible ? {} : { display: 'none' };

  const headerElement = (
    <NotificationRow className={styles.header} style={{ gridTemplateColumns }} onClick={() => setOpened(!opened)}>
      <Typography.Title level={4}>{name}</Typography.Title>
      {columns.map((type) => (
        <NotificationCheckbox
          id={type.id}
          notification={salePointNotification}
          label={`Все ${type.value}`}
        />
      ))}
      <CollapseIcon opened={opened} />
    </NotificationRow>
  );

  const contentElement = opened ? notifications.map((row) => (
    <NotificationRow className={styles.row} style={{ gridTemplateColumns }}>
      <Typography.Text>{row.name}</Typography.Text>
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
    <div className={styles.collapse} style={style}>
      {headerElement}
      <div className={styles.content}>
        {contentElement}
      </div>
    </div>
  );
});

const MassiveNotificationEditModal = observer(({ multipleEditor }) => (
  <Modal
    destroyOnClose
    title="Массовое редактирование"
    cancelText="Отмена"
    okText={multipleEditor.tableConfig.text.action}
    visible={multipleEditor.shown}
    onCancel={multipleEditor.reset}
    onOk={multipleEditor.next}
    confirmLoading={multipleEditor.loading}
  >
    <div>
      <Typography.Text type="secondary">
        {multipleEditor.tableConfig.text.description}
      </Typography.Text>
    </div>
    <div>
      <Table
        rowSelection={multipleEditor.tableConfig.rowSelection}
        columns={multipleEditor.tableConfig.columns}
        dataSource={multipleEditor.tableConfig.data}
        pagination={false}
        scroll={{ y: 500 }}
      />
    </div>
  </Modal>
));

const useSearch = (initial, getSearchField) => {
  const [search, setSearch] = useState(initial);

  const regExp = new RegExp(search, 'i');
  const filter = (v) => !search || regExp.test(getSearchField(v));

  return {
    setSearch,
    search,
    filter,
  };
};

function NotificationsList({ session }) {
  const { setSearch, search, filter } = useSearch('', (v) => v.name);
  const { personalNotifications } = session;

  const onSearchChange = (e) => {
    setSearch(e.target.value);
  };

  return (
    <Card>
      <header className={styles.cardHeader}>
        <Typography.Title level={3}>Список объектов и событий</Typography.Title>
        <Typography.Caption type="secondary">Выберите объекты по которым вы хотите получать уведомления</Typography.Caption>
        <div className={styles.headerActions}>
          <Input
            allowClear
            placeholder="Поиск.."
            value={search}
            className={styles.search}
            onChange={onSearchChange}
            prefix={<SearchOutlined />}
          />
          <Button icon={<ProfileOutlined />} onClick={personalNotifications.multipleEditor.show}>
            Массовое редактирование
          </Button>
        </div>
      </header>

      {personalNotifications.tableData.length
        ? (
          <div className={styles.table}>
            {personalNotifications.tableData.map((salePointNotification) => (
              <SalePointNotification
                visible={filter(salePointNotification)}
                key={salePointNotification.id}
                columns={personalNotifications.types}
                salePointNotification={salePointNotification}
              />
            ))}
          </div>
        ) : <Loader />}

      <MassiveNotificationEditModal multipleEditor={personalNotifications.multipleEditor} />
    </Card>
  );
}

export default inject('session')(observer(NotificationsList));
