import React from 'react';
import { inject, observer } from 'mobx-react';
import { Steps, Card } from 'antd';
import { Link } from 'react-router-dom';

import Loader from 'elements/loader';
import Format from 'elements/format';
import { devices as devicesRout, salePoints as salePointsRout } from 'routes';

const { Meta } = Card;

const { Step } = Steps;

const ELEMNT_MINIMUM_WIDTH = 400 - 24;

const Item = inject('uploadSession', 'manager')(observer(({
  id, width, uploadSession: session, manager,
}) => {
  const deviceSessionStatus = session.devices[id];
  const device = manager.devices.get(deviceSessionStatus.deviceId);
  const CardWrap = ({ children, ...props }) => (
    <Card
      style={{ width }}
      type="inner"
      {...props}
    >
      { children }
    </Card>
  );
  if (!device) {
    return <CardWrap><Format>{device}</Format></CardWrap>;
  }
  return (
    <CardWrap
      cover={(
        <div>
          {
            device ? (
              <>
                {`Обновление ${session.packetName} для `}
                <Link to={`${devicesRout.path}/${id}`}><Format width={width}>{device.name}</Format></Link>
                {' расположенном в '}
                <Link to={`${salePointsRout.path}/${device.salePointId}`}><Format width={width}>{device.salePointName}</Format></Link>
              </>
            ) : <Loader />
          }
        </div>
      )}
    >
      <Steps current={deviceSessionStatus.statusId}>
        <Step description="Ожидает загрузки" />
        <Step description="Ожидает подтверждения" />
        <Step description="Загружен" />
      </Steps>
    </CardWrap>
  );
}));

export { Item, ELEMNT_MINIMUM_WIDTH };
