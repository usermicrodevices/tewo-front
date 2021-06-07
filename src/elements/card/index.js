import React from 'react';
import { Card } from 'antd';
import classnames from 'classnames';

import style from './style.module.scss';

const FullHeightCard = ({ children, className, noMargin }) => (
  <Card className={classnames(className, noMargin && style.noMargin, style.card)}>{ children }</Card>
);

export default FullHeightCard;
