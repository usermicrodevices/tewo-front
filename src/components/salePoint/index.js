import React from 'react';
import { inject, observer } from 'mobx-react';
import { Space } from 'antd';

import Location from 'elements/location';
import FavoriteButton from 'elements/favoriteButton';

import Sales from './sales';
import Stats from './stats';
import Top from './top';
import Performance from './performance';
import DevicesList from './devicesList';

import style from './style.module.scss';

const SalePointTitleAction = inject('element')(observer(({
  element: {
    toggleFavorite, isFavorite, location, address,
  },
}) => (
  <Space>
    <FavoriteButton enabled={isFavorite} onClick={toggleFavorite} />
    <Location location={location} address={address} />
  </Space>
)));

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
