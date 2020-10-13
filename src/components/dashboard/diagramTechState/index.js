import React from 'react';
import { inject, observer } from 'mobx-react';
import { Progress } from 'antd';

import Loader from 'elements/loader';

import classes from './index.module.scss';

const Diagram = ({ value, amount, label }) => (
  <div className={classes.diagram}>
    <Progress type="circle" percent={value / amount * 100} format={() => (amount ? `${value}/${amount}` : <Loader />)} />
    <div>{label}</div>
  </div>
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
    <Diagram amount={devicesAmount} value={offDevicesAmount} label="Выключенное оборудование" />
    <Diagram amount={devicesAmount} value={devicesServceRequiredAmount} label="Требуется обслуживание" />
    <Diagram amount={devicesAmount} value={devicesHardWaterAmount} label="Жесткость превышена" />
  </div>
)));

export default DiagramTechState;
