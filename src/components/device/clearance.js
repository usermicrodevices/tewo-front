import React from 'react';
import { Card, Button } from 'antd';

import Icon from 'elements/icon';

import Badge from './badge';
import style from './tech/index.module.scss';

const Clearance = () => (
  <Card className={style.clearance}>
    <div className={style.title}>
      <div>
        <Icon size={18} name="flip-2-outline" />
        Очистка
      </div>
      <div className={style.calendar}>
        <Button
          icon={<Icon size={18} name="calendar-outline" />}
          type="text"
        >
          Календарь очисток
        </Button>
      </div>
    </div>
    <div className={style.badges}>
      <Badge
        value={undefined}
        label=""
      />
      <Badge
        value={undefined}
        label=""
      />
      <Badge
        value="14.07.20"
        action={() => 'xxx'}
        label="11:34"
      />
    </div>
  </Card>
);

export default Clearance;
