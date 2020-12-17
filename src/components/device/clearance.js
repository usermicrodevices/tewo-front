import React from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Card, Button } from 'antd';

import Icon from 'elements/icon';
import Typography from 'elements/typography';

import Badge from './badge';
import style from './genericStyle.module.scss';

const Clearance = ({
  history: { push },
  location: { pathname },
  element: { details: { serviceEvents, lastClearances } },
}) => Array.isArray(serviceEvents) && serviceEvents.length > 0 && (
  <Card className={style.clearance}>
    <div className={style.title}>
      <Typography.Title level={4}>
        <Icon size={18} name="flip-2-outline" />
        Очистка
      </Typography.Title>
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
        lastClearances.map(({ id, openDate }) => (
          <Badge
            key={id}
            value={openDate.format('DD.MM.YY')}
            label={openDate.format('hh:mm')}
          />
        ))
      }
    </div>
  </Card>
);

export default withRouter(inject('element')(observer(Clearance)));
