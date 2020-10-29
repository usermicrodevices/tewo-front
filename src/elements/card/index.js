import React from 'react';
import { Card } from 'antd';
import classnames from 'classnames';

import style from './style.module.scss';

const FullHeightCard = ({ children, className }) => (
  <Card className={classnames(className, style.card)}>{ children }</Card>
);

export default FullHeightCard;
