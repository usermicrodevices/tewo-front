import React from 'react';
import { inject, observer } from 'mobx-react';

import Location from 'elements/location';

import Sales from './sales';
import Stats from './stats';
import Top from './top';
import Performance from './performance';
import DevicesList from './devicesList';

import style from './style.module.scss';

const SalePointTitleAction = inject('element')(observer(({ element: { location, address } }) => <Location location={location} address={address} />));

const SalePointOverview = () => (
  <div className={style.main}>
    <Sales />
    <Stats />
    <Top />
    <Performance />
    <DevicesList />
  </div>
);

export { SalePointOverview, SalePointTitleAction };
