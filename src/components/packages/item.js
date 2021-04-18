import React from 'react';
import { inject, observer } from 'mobx-react';
import { Steps, Card } from 'antd';
import { UserOutlined, SolutionOutlined, LoadingOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

import Loader from 'elements/loader';
import Format from 'elements/format';
import { devices as devicesRout, salePoints as salePointsRout } from 'routes';

const { Step } = Steps;

const ELEMNT_MINIMUM_WIDTH = 400 - 24;

const Item = inject('uploadSession', 'manager')(observer(({
  id, width, uploadSession: session, manager,
}) => {
  const deviceSessionStatus = session.devices[id];
  const device = manager.devices.get(deviceSessionStatus.device);
  return (
    <Card
      style={{ width }}
      cover={(
        <div>
          {
            device ? (
              <>
                {`Обновление ${session.name} для `}
                <Link to={`${devicesRout.path}/${id}`}><Format width={width}>{device.name}</Format></Link>
                {' расположенном в '}
                <Link to={`${salePointsRout.path}/${device.salePointId}`}><Format width={width}>{device.salePointName}</Format></Link>
              </>
            ) : <Loader />
          }
        </div>
      )}
    >
      <Steps current={deviceSessionStatus.status}>
        <Step status="finish" icon={<UserOutlined />} />
        <Step status="finish" icon={<SolutionOutlined />} />
        <Step status="process" icon={<LoadingOutlined />} />
      </Steps>
    </Card>
  );
}));

export { Item, ELEMNT_MINIMUM_WIDTH };
