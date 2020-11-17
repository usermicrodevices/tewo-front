import React from 'react';
import { inject, observer, Provider } from 'mobx-react';
import {
  Card, Input, Button, Modal, Table, Dropdown,
} from 'antd';
import { SearchOutlined, ProfileOutlined, FilterOutlined } from '@ant-design/icons';

import Typography from 'elements/typography';
import Loader from 'elements/loader';
import Filters from 'elements/filters';

import SalePointNotification from './pointNotification';

import styles from './style.module.scss';

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
    <div className={styles.modalDescription}>
      <Typography.Text type="secondary">
        {multipleEditor.tableConfig.text.description}
      </Typography.Text>
    </div>

    {multipleEditor.tableConfig.filters ? (
      <Provider filter={multipleEditor.tableConfig.filters}>
        <Filters />
      </Provider>
    ) : null}

    <Table
      rowSelection={multipleEditor.tableConfig.rowSelection}
      columns={multipleEditor.tableConfig.columns}
      dataSource={multipleEditor.tableConfig.data}
      pagination={false}
      scroll={{ y: 450 }}
    />
  </Modal>
));

function NotificationsList({ session }) {
  const { personalNotifications } = session;
  const { setSearch, search, filters } = personalNotifications;

  const onSearchChange = (e) => {
    setSearch(e.target.value);
  };

  return (
    <Provider filter={filters}>
      <Card>
        <header className={styles.cardHeader}>
          <Typography.Title level={3}>Список объектов и событий</Typography.Title>
          <Typography.Caption type="secondary">Выберите объекты, типы событий и каналы отправки, по которым вы хотите получать уведомления.</Typography.Caption>
          <div className={styles.headerActions}>
            <div>
              <Input
                allowClear
                placeholder="Поиск.."
                value={search}
                className={styles.search}
                onChange={onSearchChange}
                prefix={<SearchOutlined />}
              />
              <Dropdown overlay={<Filters />} trigger={['click', 'hover']} placement="bottomRight">
                <Button
                  type={filters.search !== '' ? 'primary' : 'default'}
                  icon={<FilterOutlined />}
                />
              </Dropdown>
            </div>
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
                  key={salePointNotification.id}
                  salePointNotification={salePointNotification}
                />
              ))}
            </div>
          ) : <Loader />}

        <MassiveNotificationEditModal multipleEditor={personalNotifications.multipleEditor} />
      </Card>
    </Provider>

  );
}

export default inject('session')(observer(NotificationsList));
