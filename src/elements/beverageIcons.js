/* eslint max-len: off */
import React from 'react';

import Icon from 'elements/icon';
import { Tooltip } from 'antd';
import Loader from 'elements/loader';

const RENAMER = {
  card: 'credit-card-outline',
  qr: 'grid-outline',
  free: 'shake-outline',
};

const DEFAULT_ICON = 'cast-outline';

const typeNameToIcon = (typeName) => {
  if (typeof typeName === 'undefined') {
    return <Loader />;
  }
  if (typeName === '' || typeName === null) {
    return '—';
  }
  const iconName = RENAMER[typeName] || DEFAULT_ICON;
  return <Tooltip placement="topLeft" title={typeName}><div><Icon size="large" name={iconName} /></div></Tooltip>;
};

const canceledIcon = <Icon name="minus-circle-outline" />;

export { typeNameToIcon, canceledIcon };
