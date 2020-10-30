import React from 'react';
import { Space } from 'antd';

import LocationPopup from 'elements/locationPopup';
import Format from 'elements/format';
import Icon from 'elements/icon';

const Location = ({ location, address }) => {
  if (!location) {
    if (address) {
      return <Format width={400}>{ address }</Format>;
    }
    return null;
  }
  if (!address) {
    return <Format width={400}>{ location }</Format>;
  }
  return (
    <LocationPopup location={location}>
      <Space>
        <Icon name="pin-outline" />
        <Format width={400}>{ address }</Format>
      </Space>
    </LocationPopup>
  );
};

export default Location;
