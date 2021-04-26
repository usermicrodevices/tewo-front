import React from 'react';
import { observer, inject, Provider } from 'mobx-react';
import {
  Modal, Button, Space, Input,
} from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

import Icon from 'elements/icon';
import plural from 'utils/plural';
import SelectableTable from 'elements/table/selectableTable';
import Selector from 'elements/filters/select';
import { FiltersButton } from 'elements/filters';

import classNames from './css.module.scss';

const Wizard = inject('manager')(observer(({ manager }) => {
  if (manager.newSession === null) {
    return null;
  }
  const onCancel = () => {
    manager.clearNewSession();
  };
  const onOk = () => {
    const packet = manager.packets.get(manager.newSession.packet);
    const devices = [...manager.newSession.devices.values()].map((deviceId) => manager.devices.get(deviceId));
    Modal.confirm({
      title: `Начать загрузку пакета "${packet.name}"?`,
      icon: <ExclamationCircleOutlined />,
      content: (
        <div>
          {`Пакет ${packet.name} (${packet.description}) ${packet.version ? `, версия ${packet.version}` : ''} `}
          {'будет загружен на следующие устройства:'}
          <ul>
            {
              devices.map((device) => (
                <li key={device.key}>{`${device.id}: ${device.name} ${device.serial ? `(${device.serial})` : ''}`}</li>
              ))
            }
          </ul>
        </div>
      ),
      onOk: manager.submitNewSession,
      onCancel: () => {},
    });
  };

  const onSelectDevice = (devices) => {
    // eslint-disable-next-line no-param-reassign
    manager.newSession.devices = devices;
  };
  const ds = manager.devices.isLoaded ? manager.devices.data
    .map(({
      id, name, salePointName, serial, companyName,
    }) => ({
      key: id, name, salePointName, serial, companyName,
    })) : undefined;

  const { filter } = manager.devices;
  const onSearchChange = (action) => {
    filter.searchText = action.target.value;
  };

  const title = (
    <div className={classNames.title}>
      <div>Загрузка пакета</div>
      <Space>
        <Input placeholder="Поиск" allowClear prefix={<Icon name="search-outline" />} value={filter.searchText} onChange={onSearchChange} />
        <FiltersButton />
      </Space>
    </div>
  );

  const selectedDevicesCount = manager.newSession.devices.size;
  const footer = (
    <div className={classNames.footer}>
      <Space>
        {
          manager.devices.isLoaded && (
            `Выбрано ${
              selectedDevicesCount
            }/${
              manager.devices.rawData.length
            } ${
              plural(manager.devices.rawData.length, ['устройство', 'устройств', 'устройства'])
            }`
          )
        }
        <Selector
          title="Пакет"
          isSingle
          value={manager.newSession.packet}
          // eslint-disable-next-line no-param-reassign
          onChange={(packet) => { manager.newSession.packet = packet || null; }}
          selector={manager.packets.selector}
        />
      </Space>
      <div>
        <Button onClick={onCancel}>Отмена</Button>
        <Button type="primary" onClick={onOk} disabled={selectedDevicesCount === 0 || manager.newSession.packet === null}>
          {
            // eslint-disable-next-line
            selectedDevicesCount === 0
              ? 'Устройства не выбраны'
              : manager.newSession.packet === null
                ? 'Не выбран пакет'
                : 'Начать загрузку пакета'
          }
        </Button>
      </div>
    </div>
  );

  return (
    <Provider filter={manager.devices.filter}>
      <Modal
        title={title}
        visible
        width="80vw"
        bodyStyle={{
          maxHeight: '80vh',
        }}
        className={classNames.wrap}
        footer={footer}
        onOk={onOk}
        onCancel={onCancel}
      >
        <SelectableTable
          className={classNames.table}
          onSelect={onSelectDevice}
          columns={{
            serial: {
              title: 'Серийный номер',
              grow: 2,
            },
            name: {
              title: 'Название',
              grow: 2,
            },
            salePointName: {
              title: 'Объект',
              grow: 2,
            },
            companyName: {
              title: 'Компания',
              grow: 2,
            },
          }}
          dataSource={ds}
        />
      </Modal>
    </Provider>
  );
}));

export default Wizard;
