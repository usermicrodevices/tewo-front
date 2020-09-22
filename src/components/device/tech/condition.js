import React from 'react';
import { Card, Progress } from 'antd';
import { inject, observer } from 'mobx-react';
import classnames from 'classnames';

import Badge from '../badge';
import style from './index.module.scss';
import genericStyle from '../genericStyle.module.scss';

const DATE_FORMAT = 'DD.MM.YY';

const Condition = ({ element: { details: { stats, lastService, clearancesAmount } } }) => (
  <Card className={style.condition}>
    <div className={classnames(genericStyle.title, style.title)}>
      <Progress percent={stats ? stats.techServicesPercentage : 0} showInfo={false} size="small" strokeColor="#2979BD" />
    </div>
    <div className={genericStyle.badges}>
      <Badge
        value={stats && `${stats.techServicesDid}`}
        subvalue={stats && `/${stats.techServicesWhole}`}
        label="тех. обслуживание"
      />
      <Badge
        value={stats && stats.waterQualityMetric}
        label="жесткость воды"
      />
      <Badge
        value={clearancesAmount}
        label="очисток за 7 дней"
      />
      <Badge
        value={lastService && lastService.format(DATE_FORMAT)}
        label="предыдущее ТО"
      />
      <Badge
        value={stats && stats.techServiceForecastDate.format(DATE_FORMAT)}
        label="следующее ТО"
      />
    </div>
  </Card>
);

export default inject('element')(observer(Condition));
