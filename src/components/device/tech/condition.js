import React from 'react';
import { Card, Progress } from 'antd';
import { inject, observer } from 'mobx-react';
import classnames from 'classnames';

import Badge from '../badge';
import style from './index.module.scss';
import genericStyle from '../genericStyle.module.scss';

const Condition = ({ element: { details: { stats } } }) => (
  <Card className={style.condition}>
    <div className={classnames(genericStyle.title, style.title)}>
      <Progress percent={stats ? stats.techServicesPercentage : 0} showInfo={false} size="small" strokeColor="#2979BD" />
    </div>
    <div className={genericStyle.badges}>
      <Badge
        value={stats && stats.techServicesDid}
        subvalue={stats && `/${stats.techServicesWhole}`}
        label="тех. обслуживание"
      />
      <Badge
        value={stats && stats.waterQualityMetric}
        label="жесткость воды"
      />
      <Badge
        value={undefined}
        label="очисток за 7 дней"
      />
      <Badge
        value={undefined}
        label="предыдущее ТО"
      />
      <Badge
        value={stats && stats.techServiceForecastDate.format('DD.MM.YY')}
        label="следующее ТО"
      />
    </div>
  </Card>
);

export default inject('element')(observer(Condition));
