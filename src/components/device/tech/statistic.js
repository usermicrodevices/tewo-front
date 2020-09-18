import React from 'react';
import { Card } from 'antd';

import Icon from 'elements/icon';

import Badge from '../badge';
import style from './index.module.scss';

const Statistic = () => (
  <Card className={style.statistic}>
    <div className={style.title}>
      <Icon size={18} name="bar-chart-outline" />
      Статистика за период
    </div>
    <div className={style.badges}>
      <Badge
        value={undefined}
        subvalue={undefined}
        label="наливов за период"
      />
      <Badge
        value={undefined}
        subvalue={undefined}
        label="фактическое кол-во очисток"
      />
      <Badge
        value={undefined}
        subvalue={undefined}
        action={() => 'xxx'}
        label="ожидаемое кол-во очисток"
      />
    </div>
  </Card>
);

export default Statistic;
