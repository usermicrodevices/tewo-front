import React from 'react';
import { inject, observer } from 'mobx-react';

import Format from 'elements/format';
import plural from 'utils/plural';

import style from './index.module.scss';

const SpidometrTitle = inject('session')(observer(({ settings: { salePoints } }) => {
  if (!Array.isArray(salePoints) || salePoints.length === 0) {
    return null;
  }
  const { name } = salePoints[0];
  if (salePoints.length === 1) {
    return name;
  }
  const more = salePoints.length - 1;
  return `${name} и ещё ${more} ${plural(more, ['объект', 'объектов', 'объекта'])}`;
}));

const Spidometr = inject('storage')(observer(({ storage: { value } }) => (
  <div className={style.root}>
    <div className={style.value}><Format width={150}>{value}</Format></div>
    <svg className={style.css} viewBox="-100 -100 200 200">
      <path d="M0 0-50 50A50 70 0 0 1-50-50Z" fill="#f00" />
      <path d="M0 0-50-50A99 99 0 0 1 50-50Z" fill="#080" />
      <path d="M0 0 50-50A99 99 0 0 1 50 50Z" fill="#dd0" />
      <path d="M0 0 50 50A99 99 0 0 1-50 50Z" fill="#04e" />
    </svg>
  </div>
)));

export { Spidometr, SpidometrTitle };
