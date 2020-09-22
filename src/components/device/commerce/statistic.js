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
        value={details.periodBeveragesAmount}
        label="наливов за период"
      />
      <Badge
        value={undefined}
        subvalue={undefined}
        label="использовано QR менеджера"
      />
      <Badge
        value={undefined}
        subvalue={undefined}
        action={() => 'xxx'}
        label="динамика продаж"
      />
      <Badge
        value={undefined}
        subvalue={undefined}
        label="сумма денег руб"
      />
      <Badge
        value={undefined}
        subvalue={undefined}
        action={() => 'xxx'}
        label="потрачено зёрен"
      />
      <Badge
        value={undefined}
        subvalue={undefined}
        action={() => 'xxx'}
        label="потрачено молока"
      />
    </div>
  </Card>
);

export default inject('element')(observer(Statistic));
