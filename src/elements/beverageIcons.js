/* eslint max-len: off */
import React from 'react';

import Icon from 'elements/icon';
import { Tooltip } from 'antd';
import Loader from 'elements/loader';

const RENAMER = {
  card: 'credit-card-outline',
  qr: 'grid-outline',
  free: 'minus-outline',
};

const OPERATION_ID_TO_ICON_NAME = {
  1: 'minus-outline',
  3: 'gift-outline',
  4: 'person-outline',
  5: 'grid-outline',
  6: 'credit-card',
  7: 'shake-outline',
  8: 'credit-card-outline',
  9: 'file-text-outline',
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

const OperationIcon = ({ id, description = '' }) => {
  const iconName = OPERATION_ID_TO_ICON_NAME[id] || DEFAULT_ICON;

  return <Tooltip placement="topLeft" title={description}><div><Icon size="large" name={iconName} /></div></Tooltip>;
};

const canceledIcon = <Icon name="minus-circle-outline" />;

export { typeNameToIcon, OperationIcon, canceledIcon };
