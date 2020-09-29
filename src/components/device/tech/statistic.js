import React from 'react';
import { Card } from 'antd';
import { inject, observer } from 'mobx-react';

import Icon from 'elements/icon';

import Badge from '../badge';
import style from './index.module.scss';
import genericStyle from '../genericStyle.module.scss';

const Statistic = ({ element: { details } }) => (
  <Card className={style.statistic}>
    <div className={genericStyle.title}>
      <Icon size={18} name="bar-chart-outline" />
      Статистика за период
    </div>
    <div className={genericStyle.badges}>
      <Badge
        value={details.beveragesStats.beveragesCur}
        label="наливов за период"
      />
      <Badge
        value={details.clearancesChart?.actualSum}
        label="фактическое кол-во очисток"
      />
      <Badge
        value={details.clearancesChart?.expectedSum}
        label="ожидаемое кол-во очисток"
      />
    </div>
  </Card>
);

export default inject('element')(observer(Statistic));
