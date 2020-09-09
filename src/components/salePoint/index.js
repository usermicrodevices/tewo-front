import React from 'react';
import { inject, observer } from 'mobx-react';
import { Space } from 'antd';

import LocationPopup from 'elements/locationPopup';
import Format from 'elements/format';
import Icon from 'elements/icon';
import Loader from 'elements/loader';

import Chart from './salesChart';
import Stats from './stats';
import Top from './top';
import Performance from './performance';

import style from './style.module.scss';

const SalePointTitleAction = inject('element')(observer(({ element: { location, address } }) => (
  <LocationPopup location={location}>
    <Space>
      <Icon name="pin-outline" />
      <Format>{ address }</Format>
    </Space>
  </LocationPopup>
)));

const SalePointOverview = inject('element')(observer(({ element }) => {
  if (element.details === null) {
    return <Loader />;
  }
  return (
    <div className={style.main}>
      <Chart />
      <Stats />
      <Top />
      <Performance />
    </div>
  );
}));

export { SalePointOverview, SalePointTitleAction };
