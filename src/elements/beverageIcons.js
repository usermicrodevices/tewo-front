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

const cnaceledIconStyle = {
  stroke: '#8C8C8C', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round',
};
const canceledIcon = (
  <svg width="24" height="19" viewBox="0 0 24 19" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path style={cnaceledIconStyle} d="M1.13672 7.152H22.2714H1.13672ZM5.83332 13.0228H7.00747H5.83332ZM11.7041 13.0228H12.8782H11.7041ZM4.65917 17.7194H18.749C19.6832 17.7194 20.5791 17.3482 21.2397 16.6877C21.9003 16.0271 22.2714 15.1311 22.2714 14.1969V4.8037C22.2714 3.86949 21.9003 2.97354 21.2397 2.31295C20.5791 1.65236 19.6832 1.28125 18.749 1.28125H4.65917C3.72496 1.28125 2.82901 1.65236 2.16842 2.31295C1.50783 2.97354 1.13672 3.86949 1.13672 4.8037V14.1969C1.13672 15.1311 1.50783 16.0271 2.16842 16.6877C2.82901 17.3482 3.72496 17.7194 4.65917 17.7194Z" />
  </svg>
);

export { typeNameToIcon, canceledIcon };
