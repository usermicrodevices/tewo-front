import React from 'react';
import { inject, observer } from 'mobx-react';
import { Card, Table, Button } from 'antd';
import classNames from 'classnames';

import Icon from 'elements/icon';
import Loader from 'elements/loader';
import Format from 'elements/format';

import style from './style.module.scss';

const COLUMNS = [
  {
    title: 'Объект',
    dataIndex: 'salePointName',
    render: (name) => <Format>{name}</Format>,
  },
  {
    title: 'Название',
    dataIndex: 'name',
  },
  {
    title: 'Дата синхронизации',
    dataIndex: 'syncDate',
    render: () => <Format>{null}</Format>,
  },
  {
    title: 'Признак',
    dataIndex: 'isCynchronized',
    render: (isCynchronized) => (
      <span className={classNames(style.sync, { [style.synced]: isCynchronized })}>
        {isCynchronized ? 'Синхронизировано' : 'Не синхронизировано'}
      </span>
    ),
  },
  {
    title: '',
    dataIndex: 'rm',
    render: (rm) => <Button disabled className={style.rm} icon={<Icon size={20} name="trash-2-outline" />} type="text" onClick={rm} />,
  },
];

const toDataSource = (device) => ({
  key: device.id,
  name: device.name,
  syncDate: null,
  isCynchronized: false,
  salePointName: device.salePointName,
});

const DevicesList = ({ element }) => (
  <Card className={style.card}>
    <div className={style.title}>
      <div className={style.titletext}>
        Список оборудования
        <span className={style.amount}>{` (${element.devicesIdSet.size})`}</span>
      </div>
      <Button type="text" disabled icon={<Icon size={22} name="plus-circle-outline" />} />
    </div>
    { element.devices
      ? <Table pagination={false} columns={COLUMNS} dataSource={element.devices.map(toDataSource)} />
      : <Loader size="large" /> }
  </Card>
);

export default inject('element')(observer(DevicesList));
