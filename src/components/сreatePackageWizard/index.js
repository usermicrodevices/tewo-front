import React, { useState } from 'react';
import { observer, inject } from 'mobx-react';
import { Modal } from 'antd';

import plural from 'utils/plural';
import SelectableTable from 'elements/table/selectableTable';

import classNames from './css.module.scss';

const Wizard = inject('packetsHolder')(observer(({ packetsHolder }) => {
  const [stage, setStage] = useState(0);
  const onNext = () => {
    if (stage === 0) {
      setStage(1);
      return;
    }
    packetsHolder.submitnewSession();
  };
  const onPrew = () => {
    if (stage === 0) {
      packetsHolder.clearNewSession();
      return;
    }
    setStage(0);
  };
  const selectedDevicesCount = packetsHolder.newSession?.devices?.size;
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
  const okText = [
    selectedDevicesCount ? 'Далее' : 'Устройства не выбраны',
    `Загрузить на ${plural(selectedDevicesCount, ['устройство', 'устройства', 'устройства'])} (${selectedDevicesCount} / ${ds?.length})`,
  ];
  const okType = ['default', 'primary'];
  const cancelText = ['Отмена', 'Назад'];
  return (
    <Modal
      title="Загрузка пакета"
      visible={packetsHolder.newSession !== null}
      onOk={onNext}
      onCancel={onPrew}
      okText={okText[stage]}
      okType={okType[stage]}
      cancelText={cancelText[stage]}
      okButtonProps={{ disabled: selectedDevicesCount === 0 }}
      width="80vw"
      bodyStyle={{
        maxHeight: '80vh',
      }}
    >
      {
        stage === 0 && (
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
        )
      }
      {
        stage === 1 && (
          'not implemented facepunch'
        )
      }
    </Modal>
  );
}));

export default Wizard;
