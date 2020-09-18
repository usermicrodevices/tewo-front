import React from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Button, Space, Modal } from 'antd';

import Location from 'elements/location';
import Icon from 'elements/icon';
import Tech from './tech';
import Voltage from './voltage';
import Commerce from './commerce';
import Calendar from './calendar';

import style from './index.module.scss';

const DeviceTitleAction = withRouter(inject(({ element, session }) => ({ element, session }))(observer(({
  history,
  session: { events, beverages },
  element: {
    id,
    isOn,
    salePointLocation,
    salePointAddress,
  },
}) => (
  <div className={style.actions}>
    <Space>
      <Location location={salePointLocation} address={salePointAddress} />
      <Space size={4}>
        <span className={style.link}><Icon name="power-outline" /></span>
        Статус
        <span className={style.link}>{isOn ? 'ВКЛ' : 'ВЫКЛ'}</span>
      </Space>
    </Space>
    <Space>
      <Button onClick={() => history.push(events.getPathForDevice(id))}>События</Button>
      <Button onClick={() => history.push(beverages.getPathForDevice(id))}>Наливы</Button>
    </Space>
  </div>
))));

const DeviceOverview = withRouter(({ history: { goBack }, match: { params: { action } } }) => {
  switch (action) {
    case 'voltage':
      return <Voltage />;
    case 'commerce':
      return <Commerce />;
    default:
      return (
        <>
          <Modal
            title="Календарь очисток"
            visible={action === 'calendar'}
            onOk={goBack}
            onCancel={goBack}
          >
            <Calendar />
          </Modal>
          <Tech />
        </>
      );
  }
});

export { DeviceTitleAction, DeviceOverview };
