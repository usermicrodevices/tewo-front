import React from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Button, Space, Modal } from 'antd';

import DeviceStatus from 'elements/deviceStatus';
import Location from 'elements/location';
import Calendar from 'elements/calendar';

import Tech from './tech';
import Commerce from './commerce';
import Voltage from './voltage';

import style from './index.module.scss';

const DeviceTitleAction = withRouter(inject(({ element, session }) => ({ element, session }))(observer(({
  history,
  session: { events, beverages, points },
  element: {
    id,
    isOn,
    salePointLocation,
    salePointAddress,
    salePointId,
    isFavorite,
  },
}) => (
  <div className={style.actions}>
    <Space size={8}>
      <Location location={salePointLocation} address={salePointAddress} />
      <DeviceStatus isOn={isOn} announce="Статус" />
      <div>
        В избранном:
        {isFavorite ? ' да' : ' нет'}
      </div>
    </Space>
    <Space>
      <Button onClick={() => history.push(events.getPathForDevice(id))}>События</Button>
      <Button onClick={() => history.push(beverages.getPathForDevice(id))}>Наливы</Button>
      <Button onClick={() => history.push(points.getPathForPoint(salePointId))}>Объект</Button>
    </Space>
  </div>
))));

const DeviceOverview = withRouter(inject('element')(observer(({
  element: { details: { allClearancesDates } },
  history: { goBack },
  match: { params: { action } },
}) => {
  switch (action) {
    case 'commerce':
      return <Commerce />;
    case 'voltage':
      return <Voltage />;
    default:
      return (
        <>
          <Modal
            title="Календарь очисток"
            visible={action === 'calendar'}
            onOk={goBack}
            onCancel={goBack}
            wrapClassName={style.calendar}
            footer={null}
          >
            <Calendar clearances={allClearancesDates} />
          </Modal>
          <Tech />
        </>
      );
  }
})));

export { DeviceTitleAction, DeviceOverview };
