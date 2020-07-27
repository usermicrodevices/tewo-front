import React from 'react';
import { Card } from 'antd';

import style from './style.module.scss';

const FullHeightCard = ({ children }) => (
  <Card className={style.card}>{ children }</Card>
);

export default FullHeightCard;
