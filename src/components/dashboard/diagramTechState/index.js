import React from 'react';
import { inject, observer } from 'mobx-react';
import { Progress } from 'antd';
import { Link } from 'react-router-dom';

import { salePoints as salePointsRout } from 'routes';

import Loader from 'elements/loader';
import Typography from 'elements/typography';

import classes from './index.module.scss';

const Diagram = ({
  value, amount, label, color = '#FABC5F', link = '',
}) => (
  <Link to={link} className={classes.diagram}>
    <Progress
      strokeColor={color}
      type="circle"
      percent={value / amount * 100}
      format={() => (amount ? `${value || 0}/${amount || 0}` : <Loader />)}
    />
    <Typography.Text className={classes.label}>{label}</Typography.Text>
  </Link>
);

const DiagramTechState = inject('storage')(observer(({
  storage: {
    devicesAmount,
    offDevicesAmount,
    devicesServceRequiredAmount,
    devicesHardWaterAmount,
  },
}) => (
  <div className={classes.root}>
    <Diagram
      amount={devicesAmount}
      value={offDevicesAmount}
      color="rgb(245,110,100)"
      link={`${salePointsRout.path}?isHaveDisabledEquipment__exact=1`}
      label="Оборудование выключено"
    />
    <Diagram
      amount={devicesAmount}
      value={devicesServceRequiredAmount}
      link={`${salePointsRout.path}?isNeedTechService__exact=1`}
      label="Требуется обслуживание"
    />
    <Diagram
      amount={devicesAmount}
      value={devicesHardWaterAmount}
      link={`${salePointsRout.path}?isHasOverlocPPM__exact=1`}
      color="#51B8FF"
      label="Жесткость превышена"
    />
  </div>
)));

export default DiagramTechState;
