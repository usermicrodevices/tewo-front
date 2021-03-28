import React, { useState } from 'react';
import { observer, inject } from 'mobx-react';
import { Modal } from 'antd';

import SelectableTable from 'elements/table/selectableTable';

import classNames from './css.module.scss';

const Wizard = inject('packagesHolder')(observer(({ packagesHolder }) => {
  const [stage, setStage] = useState(0);
  const onNext = () => {
    if (stage === 0) {
      setStage(1);
      return;
    }
    packagesHolder.submitNewPackage();
  };
  const onPrew = () => {
    if (stage === 0) {
      packagesHolder.clearNewPackage();
      return;
    }
    setStage(0);
  };
  const okText = ['Далее', 'Загрузить'];
  const okType = ['default', 'primary'];
  const cancelText = ['Отмена', 'Назад'];
  const onSelectDevice = (devices) => {
    packagesHolder.newPackage.devices = devices;
  };
  const ds = packagesHolder.devices.isLoaded ? packagesHolder.devices.rawData
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
  return (
    <Modal
      title="Загрузка пакета"
      visible={packagesHolder.newPackage !== null}
      onOk={onNext}
      onCancel={onPrew}
      okText={okText[stage]}
      okType={okType[stage]}
      cancelText={cancelText[stage]}
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
