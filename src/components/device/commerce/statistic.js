import React from 'react';
import { inject, observer } from 'mobx-react';
import { Card } from 'antd';

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
        value={undefined}
        label="использовано QR менеджера"
      />
      <Badge
        growth={details.beveragesStats.salesDiff}
        value={details.beveragesStats.salesDiff && `${Math.round(Math.abs(details.beveragesStats.salesDiff) * 10) / 10}%`}
        label="динамика продаж"
      />
      <Badge
        value={details.beveragesStats.salesCur}
        label="сумма денег руб"
      />
      <Badge
        label="потрачено зёрен"
      />
      <Badge
        label="потрачено молока"
      />
    </div>
  </Card>
);

export default inject('element')(observer(Statistic));
