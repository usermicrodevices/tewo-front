import React from 'react';
import { inject, observer } from 'mobx-react';
import {
  Button, Checkbox, Popconfirm, Space,
} from 'antd';
import classNames from 'classnames';

import Icon from 'elements/icon';
import Format from 'elements/format';

import List from './list';

import style from './style.module.scss';

const DevicesList = ({
  element, onAdd, isLoading, selected, onSelect,
}) => {
  const select = (id) => ({ target: { checked } }) => {
    selected[checked ? 'add' : 'delete'](id);
    onSelect(new Set([...selected.values()]));
  };
  const toDataSource = (device) => ({
    key: device.id,
    name: device.name,
    syncDate: device.priceSyncDate,
    isCynchronized: false,
    salePointName: device.salePointName,
    rm: () => element.removeDevice(device.id),
    setSynk: { setSync: select(device.id), isSelected: selected.has(device.id) },
    className: classNames({ 'ant-table-row-selected': selected.has(device.id) }),
  });

  const onSelectAll = ({ target: { checked } }) => {
    onSelect(new Set(checked ? [...element.devices.map(({ id }) => id)] : []));
  };

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
      title: (
        <Space>
          <Checkbox
            indeterminate={selected.size && selected.size < element.devices?.length}
            checked={selected.size === element.devices?.length}
            onChange={onSelectAll}
          />
          Cинхронизация
        </Space>
      ),
      dataIndex: 'setSynk',
      render: ({ setSync, isSelected }) => <Checkbox onChange={setSync} checked={isSelected} />,
    },
    {
      title: '',
      dataIndex: 'rm',
      render: (rm) => (
        <Popconfirm
          placement="left"
          title="Отмена операции невозможна. Продолжить удаление?"
          onConfirm={rm}
          okText="Да"
          cancelText="Нет"
        >
          <Button icon={<Icon size={20} name="trash-2-outline" />} type="text" />
        </Popconfirm>
      ),
    },
  ];

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
