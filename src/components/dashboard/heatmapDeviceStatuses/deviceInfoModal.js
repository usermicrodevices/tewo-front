import React from 'react';
import { observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Modal, Divider, Button } from 'antd';

import * as routes from 'routes';

import Location from 'elements/location';

const InfoRow = ({ label, text }) => (text ? (
  <p>
    <b>{label}</b>
    :
    {' '}
    <span>{text}</span>
  </p>
) : null);

function DeviceInfoModal({
  device, visible, onCancel, history,
}) {
  return (
    <Modal
      title={device && device.name}
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button key="device" onClick={() => history.push(`${routes.devices.path}/${device.id}`)}>
          Перейти на оборудование
        </Button>,
        <Button key="salePoint" onClick={() => history.push(`${routes.salePoints.path}/${device.salePoint.id}`)}>
          Перейти на объект
        </Button>,
      ]}
    >
      {device ? (
        <div>
          <div>
            <h3>{device.salePointName}</h3>
            <Location
              location={device.salePoint.location}
              address={device.salePointAddress}
            />
          </div>
          <Divider />
          <div>
            <InfoRow label="Ответственный" text={device.salePoint.person} />
            <InfoRow label="Телефон" text={device.salePoint.phone} />
            <InfoRow label="Почта" text={device.salePoint.email} />
            <InfoRow label="Модель" text={device.deviceModelName} />
            <InfoRow label="Контроллер" text={device.controller} />
            <InfoRow label="Серийный номер" text={device.serial} />
            <InfoRow label="Идентификатор" text={device.id} />
          </div>
        </div>
      ) : null}
    </Modal>
  );
}

export default withRouter(observer(DeviceInfoModal));
