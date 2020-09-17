import React from 'react';

import Clearance from '../clearance';
import ChearanceChart from './clearanceChart';
import Conditions from './condition';
import WaterChart from './waterChart';
import Beverages from './beverages';
import Statistic from './statistic';

import style from './index.module.scss';

const Commerce = () => {
  const isWaterRated = false;
  return (
    <div style={style.root}>
      <ChearanceChart />
      <Statistic />
      <Conditions />
      {
        isWaterRated
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
};

export default Commerce;
