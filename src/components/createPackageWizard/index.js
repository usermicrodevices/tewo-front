import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { observer, inject, Provider } from 'mobx-react';
import {
  Modal, Button, Space, Input,
} from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

import Icon from 'elements/icon';
import plural from 'utils/plural';
import SelectableTable from 'elements/table/selectableTable';
import { FiltersButton } from 'elements/filters';
import { deviceUpdate as deviceUpdateRout } from 'routes';

import PacketSekector from './packetSelector';

import classNames from './css.module.scss';

const Wizard = inject('manager', 'session')(observer(({ manager, session }) => {
  const [isPacketSelecting, setPacketSelecting] = useState(false);
  const history = useHistory();
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
      onOk: () => manager.submitNewSession.then(({ id }) => history.push(`${deviceUpdateRout.path[1]}/${id}`)),
      className: classNames.popupconfirm,
      onCancel: () => {},
    });
  };

  const onSelectDevice = (devices) => {
    // eslint-disable-next-line no-param-reassign
    manager.newSession.devices = devices;
  };
  const { filter } = manager.devices;
  const litePredicate = (data) => manager.newSession.devices.has(data.id) || filter.predicate(data);
  let selectedModel;
  if (manager.newSession.devices.size) {
    selectedModel = session.devices.get(manager.newSession.devices.values().next().value)?.deviceModelId;
  }
  const ds = manager.devices.isLoaded ? manager.devices.data.filter(litePredicate)
    .map(({
      id, name, salePointName, serial, companyName, deviceModelId,
    }) => ({
      key: id,
      name,
      salePointName,
      serial,
      companyName,
      disabled: selectedModel !== undefined && selectedModel !== deviceModelId,
    })) : undefined;

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

  const cancelSelectPacket = () => setPacketSelecting(false);
  const selectPacket = () => setPacketSelecting(true);
  const acceptPacket = (packet) => {
    // eslint-disable-next-line no-param-reassign
    manager.newSession.packet = packet;
    cancelSelectPacket();
  };

  const selectedDevicesCount = manager.newSession.devices.size;
  const packetDescription = (packetId) => {
    const packet = manager.packets.get(packetId);
    if (!packet) {
      return null;
    }
    return `${packet.name} ${packet.version || ''} ${packet.typeName}`;
  };
  const footer = (
    <div className={classNames.footer}>
      <Space>
        {
          manager.devices.isLoaded && (
            `Выбрано ${
              selectedDevicesCount
            }/${
              ds.length
            } ${
              plural(ds.length, ['устройство', 'устройств', 'устройства'])
            }`
          )
        }
        {
          packetDescription(manager.newSession.packet)
        }
        <Button onClick={selectPacket}>
          {
            manager.newSession.packet ? 'Выбрать другой' : 'Выбрать пакет'
          }
        </Button>
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
          disabledText="Загрузка пакета возможна только на оборудование одной модели"
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
      <PacketSekector
        isVisible={isPacketSelecting}
        onSubmit={acceptPacket}
        onCancel={cancelSelectPacket}
      />
    </Provider>
  );
}));

export default Wizard;
