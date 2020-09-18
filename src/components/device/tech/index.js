import React from 'react';
import { inject, observer } from 'mobx-react';

import Clearance from '../clearance';
import ClearanceChart from './clearanceChart';
import Conditions from './condition';
import WaterChart from './waterChart';
import Beverages from './beverages';
import Statistic from './statistic';

import genericStyle from '../genericStyle.module.scss';

const Commerce = ({ element: { details: { isWaterQualified } } }) => (
  <div className={genericStyle.root}>
    <ClearanceChart />
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
