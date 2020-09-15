/* eslint jsx-a11y/no-static-element-interactions: off */
import React from 'react';
import { Button, Space } from 'antd';

import { CopyOutlined } from '@ant-design/icons';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import LocationPopup from 'elements/locationPopup';

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

const Location = ({ location }) => (
  <Space>
    <LocationPopup location={location}>
      <span>{location.map((v) => Math.round(v * 100) / 100).join(LOCATION_SEPARATOR)}</span>
      <CopyToClipboard text={location.join(LOCATION_SEPARATOR)}>
        <Button type="text" icon={<CopyOutlined />} />
      </CopyToClipboard>
    </LocationPopup>
  </Space>
);

export { Location, tryParseLocation };
