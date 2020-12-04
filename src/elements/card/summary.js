import React from 'react';
import { Card } from 'antd';

import Icon from 'elements/icon';
import Typography from 'elements/typography';

import classes from './summary.module.scss';

const Summary = ({ children }) => (
  <Card className={classes.stats}>
    <div className={classes.title}>
      <Typography.Title level={4}>
        <Icon size={18} name="bar-chart-outline" />
        Сводная информация
      </Typography.Title>
    </div>
    { children }
  </Card>
);

export default Summary;