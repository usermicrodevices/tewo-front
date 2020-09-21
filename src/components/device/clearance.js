import React from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Card, Button } from 'antd';

import Icon from 'elements/icon';

import Badge from './badge';
import style from './genericStyle.module.scss';

const Clearance = ({
  history: { push },
  location: { pathname },
  element: { details: { serviceEvents } },
}) => (
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
      {
        Array.isArray(serviceEvents)
          ? serviceEvents.slice(0, 3).map(({ id, openDate }) => (
            <Badge
              key={id}
              value={openDate.format('DD.MM.YY')}
              label={openDate.format('hh:mm')}
            />
          ))
          : (
            <Badge
              value={undefined}
              label=""
            />
          )
      }
    </div>
  </Card>
);

export default withRouter(inject('element')(observer(Clearance)));
