import React from 'react';
import { inject, observer } from 'mobx-react';
import { Button } from 'antd';

import Icon from 'elements/icon';

import PriceList from './priceList';
import DeviceList from './devicesList';

import style from './style.module.scss';

const PriceGroupTitleAction = inject('element')(observer(
  ({ element }) => <Button icon={<Icon name="refresh-outline" />} onClick={() => element.synchronize()}>Синхронизировать</Button>,
));

const PriceGroupOverview = () => (
  <div className={style.root}>
    <DeviceList />
    <PriceList />
  </div>
);

export { PriceGroupOverview, PriceGroupTitleAction };
