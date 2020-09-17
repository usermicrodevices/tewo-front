import React from 'react';
import { inject, observer } from 'mobx-react';

import Clearance from '../clearance';
import ChearanceChart from './clearanceChart';
import Conditions from './condition';
import WaterChart from './waterChart';
import Beverages from './beverages';
import Statistic from './statistic';

import style from './index.module.scss';

const Commerce = ({ element: { details: { isWaterQualified } } }) => (
  <div className={style.root}>
    <ChearanceChart />
    <Statistic />
    <Conditions />
    {
      isWaterQualified
        ? (
          <>
            <WaterChart />
            <Clearance />
            <Beverages />
          </>
        ) : (
          <>
            <Beverages />
            <Clearance />
          </>
        )
    }
  </div>
);

export default inject('element')(observer(Commerce));
