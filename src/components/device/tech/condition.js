import React from 'react';
import { Card, Progress } from 'antd';

import Badge from '../badge';
import style from './index.module.scss';

const Condition = () => (
  <Card className={style.condition}>
    <div className={style.title}>
      <Progress percent={50} showInfo={false} size="small" strokeColor="#2979BD" />
    </div>
    <div className={style.badges}>
      <Badge
        value="1200"
        subvalue="/38800"
        label="тех. обслуживание"
      />
      <Badge
        value={undefined}
        subvalue={undefined}
        label="жесткость воды"
      />
      <Badge
        value={undefined}
        subvalue={undefined}
        action={() => 'xxx'}
        label="очисток за 7 дней"
      />
      <Badge
        action={() => 'xxx'}
        value={undefined}
        subvalue="15.05.20"
        label="предыдущее ТО"
      />
      <Badge
        value={undefined}
        subvalue={undefined}
        label="следующее ТО"
      />
    </div>
  </Card>
);

export default Condition;
