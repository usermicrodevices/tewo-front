/* eslint jsx-a11y/no-static-element-interactions: "off" */
import React from 'react';
import {
  Dropdown, Button, Space, Menu,
} from 'antd';

import { CopyOutlined } from '@ant-design/icons';
import { Map as YandexMap, Placemark } from 'react-yandex-maps';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const LOCATION_SEPARATOR = ', ';

const tryParseLocation = (txt) => {
  const coordinates = txt.split(LOCATION_SEPARATOR).map(parseFloat);
  if (coordinates.length !== 2) {
    return null;
  }
  if (coordinates.join(LOCATION_SEPARATOR) !== txt) {
    return null;
  }
  return coordinates;
};

const locationOverlay = (location) => (
  <Menu>
    <div>
      <YandexMap
        defaultState={{ center: location, zoom: 12 }}
      >
        <Placemark geometry={location} />
      </YandexMap>
    </div>
  </Menu>
);

const Location = ({ location }) => (
  <Dropdown
    overlay={locationOverlay(location)}
  >
    <Space>
      <span>{location.map((v) => Math.round(v * 100) / 100).join(LOCATION_SEPARATOR)}</span>
      <CopyToClipboard text={location.join(LOCATION_SEPARATOR)}>
        <Button type="text" icon={<CopyOutlined />} />
      </CopyToClipboard>
    </Space>
  </Dropdown>
);

export { Location, tryParseLocation };
