import React from 'react';
import { Card as AntdCard } from 'antd';
import { inject, observer } from 'mobx-react';

import Icon from 'elements/icon';
import Format from 'elements/format';
import Typography from 'elements/typography';
import ChangesLabel from 'elements/changesLabel';

import classes from './index.module.scss';

const Stats = ({ table: { wholeSales: { cur, prw } } }) => (
  <AntdCard className={classes.stats}>
    <div className={classes.title}>
      <Typography.Title level={4}>
        <Icon size={18} name="bar-chart-outline" />
        Сводная информация
      </Typography.Title>
    </div>
    <div>
      <Typography.Value size="xl"><Format>{ cur }</Format></Typography.Value>
      <Typography.Caption>сумма продаж за текущий период</Typography.Caption>
    </div>
    { cur !== prw && (
      <div>
        <ChangesLabel typographySize="xl" value={(cur - prw) / prw * 100} />
        <Typography.Caption>динамика наливов</Typography.Caption>
      </div>
    )}
    <div>
      <Typography.Value size="xl"><Format>{ prw }</Format></Typography.Value>
      <Typography.Caption>сумма продаж за предыдущий период</Typography.Caption>
    </div>
  </AntdCard>
);

export default inject('table')(observer(Stats));
