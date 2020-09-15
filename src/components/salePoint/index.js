import React from 'react';
import { inject, observer } from 'mobx-react';
import { Card, Space } from 'antd';

import LocationPopup from 'elements/locationPopup';
import Format from 'elements/format';
import Icon from 'elements/icon';

import Chart from './sales';
import Stats from './stats';
import Top from './top';
import Performance from './performance';
import DevicesList from './devicesList';

import style from './style.module.scss';

const SalePointTitleAction = inject('element')(observer(({ element: { location, address } }) => {
  if (!location) {
    if (address) {
      return <Format>{ address }</Format>;
    }
    return null;
  }
  if (!address) {
    return <Format>{ location }</Format>;
  }
  return (
    <LocationPopup location={location}>
      <Space>
        <Icon name="pin-outline" />
        <Format>{ address }</Format>
      </Space>
    </LocationPopup>
  );
}));

const SalePointOverview = () => (
  <div className={style.main}>
    <Chart />
    <Stats />
    <Top />
    <Performance />
    <DevicesList />
  </div>
);

export { SalePointOverview, SalePointTitleAction };
