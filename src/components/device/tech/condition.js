import React from 'react';
import { Card, Progress } from 'antd';
import { inject, observer } from 'mobx-react';
import classnames from 'classnames';

import Icon from 'elements/icon';

import Badge from '../badge';
import style from './index.module.scss';
import genericStyle from '../genericStyle.module.scss';

const DATE_FORMAT = 'DD.MM.YY';

const Condition = ({
  element: {
    details: {
      stats, lastService, clearancesAmount, mileage,
    },
  },
}) => {
  const techServicesLeft = stats ? stats.techServicesWhole - stats.techServicesDid : 0;

  return (
    <Card className={style.condition}>
      <div className={classnames(genericStyle.title, style.title)}>
        <Icon size={18} name="settings-2-outline" />
        Техническое обслуживание
      </div>
      <Progress percent={stats ? stats.techServicesPercentage : 0} showInfo={false} size="small" strokeColor="#2979BD" />
      <div className={genericStyle.badges}>
        <Badge
          value={stats && `${techServicesLeft}`}
          label="осталось циклов до ТО"
        />
        <Badge
          value={mileage}
          label="пробег"
        />
        <Badge
          value={clearancesAmount}
          label="очисток за 7 дней"
        />
        <Badge
          value={techServicesLeft ? stats && stats.techServiceForecastDate.format(DATE_FORMAT) : 'Требуется ТО'}
          label="прогнозируемая дата ТО"
        />
        <Badge
          value={lastService && lastService.format(DATE_FORMAT)}
          label="дата предыдущего ТО"
        />
        <Badge
          value={stats && stats.waterQualityMetric}
          label="жесткость воды"
        />
      </div>
    </Card>
  );
};

export default inject('element')(observer(Condition));
