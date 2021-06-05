import React from 'react';
import { inject, observer } from 'mobx-react';
import {
  Steps, Card, Popover, Button,
} from 'antd';
import { Link } from 'react-router-dom';
import Icon from 'elements/icon';

import Format from 'elements/format';
import { devices as devicesRout, salePoints as salePointsRout } from 'routes';

import classNames from './item.module.scss';

const { Step } = Steps;

const ELEMNT_MINIMUM_WIDTH = 550 - 24;

const Item = inject('uploadSession', 'manager')(observer(({
  id, width, uploadSession: session, manager,
}) => {
  const deviceSessionStatus = session.devices[id];
  const device = manager.devices.get(deviceSessionStatus.deviceId);
  const status = manager.deviceStatuses.get(deviceSessionStatus.statusId);
  const CardWrap = ({ children, ...props }) => (
    <Card
      style={{ width, maxWidth: width }}
      type="inner"
      // eslint-disable-next-line
      {...props}
    >
      { children }
    </Card>
  );
  if (!device) {
    return <CardWrap><Format>{device}</Format></CardWrap>;
  }
  const deviceStatuses = [...manager.deviceStatuses.values()];
  const genericStatuses = deviceStatuses
    .filter(({ weight }) => weight < 5)
    .sort((a, b) => Math.sign(a.weight - b.weight));
  const lastStatus = status.weight !== 5
    ? deviceStatuses.find(({ weight, status: statusText }) => weight === 5 && statusText !== 'failed')
    : status;
  const allSteps = [...genericStatuses, lastStatus];
  return (
    <CardWrap
      cover={(
        <div className={classNames.content}>
          <div>
            {`Обновление ${session.packetName} для `}
            <Link to={`${devicesRout.path}/${device.id}`}><Format>{device.name}</Format></Link>
            {' расположенном в '}
            <Link to={`${salePointsRout.path}/${device.salePointId}`}><Format width={width}>{device.salePointName}</Format></Link>
          </div>
          {
            status.isCancelable && <Button onClick={() => session.cancelDevice(id)}>Отмена</Button>
          }
        </div>
      )}
    >
      <div className={classNames.progress}>
        <Steps
          size="small"
          current={status.weight - 1}
          progressDot={(dot, { index }) => {
            const {
              name,
              icon,
              weight,
            } = allSteps[index];
            const isComplete = weight > status.weight;
            const iconName = isComplete ? icon : icon.replace('-outline', '');
            const statuses = deviceStatuses.filter((s) => (s.weight === weight && status.weight !== weight) || status === s)
              .sort(({ name: a }, { name: b }) => a.localeCompare(b));
            const content = statuses.length === 1 ? name : (
              statuses.map(({ name: statusName, icon: statusIconName }) => (
                <React.Fragment key={statusName}>
                  <Icon size={20} className={classNames[isComplete ? 'basic' : 'active']} name={statusIconName} />
                  {` ${statusName}`}
                  <br />
                </React.Fragment>
              ))
            );
            return (
              <Popover
                content={content}
              >
                <div>
                  <Icon size={24} className={classNames[isComplete ? 'basic' : 'active']} name={iconName} />
                  {dot}
                </div>
              </Popover>
            );
          }}
        >
          {
            allSteps.map(({ id: statusId }) => (
              <Step key={statusId} />
            ))
          }
        </Steps>
      </div>
    </CardWrap>
  );
}));

export { Item, ELEMNT_MINIMUM_WIDTH };
