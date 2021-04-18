import React from 'react';
import { observer, inject } from 'mobx-react';
import { Modal } from 'antd';

import plural from 'utils/plural';
import SelectableTable from 'elements/table/selectableTable';
import Selector from 'elements/filters/select';

import classNames from './css.module.scss';

const Wizard = inject('packetsHolder')(observer(({ packetsHolder }) => {
  if (packetsHolder.newSession === null) {
    return null;
  }
  const onCancel = () => {
    packetsHolder.clearNewSession();
  };
  const onOk = () => {
    packetsHolder.submitNewSession();
  };
  const selectedDevicesCount = packetsHolder.newSession.devices.size;
  const onSelectDevice = (devices) => {
    // eslint-disable-next-line no-param-reassign
    packetsHolder.newSession.devices = devices;
  };
  const ds = packetsHolder.devices.isLoaded ? packetsHolder.devices.rawData
    .filter(({
      id, name, salePointName, serial, companyName,
    }) => (
      true || false
    ))
    .map(({
      id, name, salePointName, serial, companyName,
    }) => ({
      key: id, name, salePointName, serial, companyName,
    })) : undefined;
  console.log(selectedDevicesCount === 0 && packetsHolder.newSession.packet, selectedDevicesCount === 0, packetsHolder.newSession.packet);
  return (
    <Modal
      title={`Загрузка пакета (${selectedDevicesCount} ${plural(selectedDevicesCount, ['устройство', 'устройств', 'устройства'])})`}
      visible
      onOk={onOk}
      onCancel={onCancel}
      width="80vw"
      okButtonProps={{ disabled: selectedDevicesCount === 0 || packetsHolder.newSession.packet === null }}
      bodyStyle={{
        maxHeight: '80vh',
      }}
      className={classNames.wrap}
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
      <div>
        <Selector
          title="Пакет"
          isSingle
          value={packetsHolder.newSession.packet}
          // eslint-disable-next-line no-param-reassign
          onChange={(packet) => { console.log(packet); packetsHolder.newSession.packet = packet || null; }}
          selector={packetsHolder.packets.selector}
        />
      </div>
    </Modal>
  );
}));

export default Wizard;
