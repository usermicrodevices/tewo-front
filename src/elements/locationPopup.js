/* eslint jsx-a11y/no-static-element-interactions: off */
import React from 'react';
import { Dropdown, Menu } from 'antd';

import { Map as YandexMap, Placemark } from 'react-yandex-maps';

const locationOverlay = (location) => (
  <Menu>
    <div style={{ minWidth: 300 }}>
      <YandexMap defaultState={{ center: location, zoom: 12 }} width="100%">
        <Placemark geometry={location} />
      </YandexMap>
    </div>
  </Menu>
);

const Location = ({ location, children }) => (
  location ? <Dropdown overlay={locationOverlay(location)}><div>{ children }</div></Dropdown> : children
);

export default Location;
