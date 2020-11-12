import React from 'react';
import { inject, observer } from 'mobx-react';
import { Button } from 'antd';
import classNames from 'classnames';

import Icon from 'elements/icon';
import Format from 'elements/format';

import List from './list';

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
    render: (v) => <Format>{v}</Format>,
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
    render: (rm) => (
      <Button
        onClick={rm}
        className={style.rm}
        icon={<Icon size={20} name="trash-2-outline" />}
        type="text"
      />
    ),
  },
];

const DevicesList = ({ element, onAdd, isLoading }) => {
  const toDataSource = (device) => ({
    key: device.id,
    name: device.name,
    syncDate: null,
    isCynchronized: false,
    salePointName: device.salePointName,
    rm: () => element.removeDevice(device.id),
  });
  return (
    <List
      isLoading={isLoading}
      dataSource={element.devices}
      toDataSource={toDataSource}
      columns={COLUMNS}
      onAdd={onAdd}
      title={`Список оборудования (${element.devicesIdSet.size})`}
    />
  );
};

export default inject('element')(observer(DevicesList));
