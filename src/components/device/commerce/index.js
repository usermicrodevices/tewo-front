import React from 'react';

import Chart from './chart';
import Clearance from '../clearance';
import Statistic from './statistic';

import style from './index.module.scss';

const Commerce = () => (
  <div style={style.root}>
    <Chart />
    <Statistic />
    <Clearance />
  </div>
);

export default Commerce;
