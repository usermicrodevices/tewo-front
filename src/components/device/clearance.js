import React from 'react';
import { withRouter } from 'react-router-dom';
import { Card, Button } from 'antd';

import Icon from 'elements/icon';

import Badge from './badge';
import style from './genericStyle.module.scss';

const Clearance = ({ history: { push }, location: { pathname } }) => (
  <Card className={style.clearance}>
    <div className={style.title}>
      <div>
        <Icon size={18} name="flip-2-outline" />
        Очистка
      </div>
      <div className={style.calendar}>
        <Button
          onClick={() => { push(`${pathname.split('/').slice(0, 3).join('/')}/calendar`); }}
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

export default withRouter(Clearance);
