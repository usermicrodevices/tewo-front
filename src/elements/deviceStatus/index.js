import React from 'react';
import { Space } from 'antd';

import Icon from 'elements/icon';

import style from './index.module.scss';

const DeviceStatus = ({ isOn, announce }) => (
  <Space size={4}>
    <span className={style.link}><Icon name="power-outline" /></span>
    {announce}
    <span className={style.link}>{isOn ? 'ВКЛ' : 'ВЫКЛ'}</span>
  </Space>
);

export default DeviceStatus;
