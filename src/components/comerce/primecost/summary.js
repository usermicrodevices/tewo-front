import React from 'react';
import { inject, observer } from 'mobx-react';

import SummaryCard from 'elements/card/summary';
import Typography from 'elements/typography';
import Format from 'elements/format';

import classes from './summary.module.scss';

const Row = ({ earn, cost, margin }) => (
  <div className={classes.row}>
    <div>
      <Typography.Value size="xl">
        <Format>{ earn }</Format>
        ₽
      </Typography.Value>
      <Typography.Caption className={classes.caption}>выручка</Typography.Caption>
    </div>
    <div>
      <Typography.Value size="xl">
        <Format>{ cost }</Format>
        ₽
      </Typography.Value>
      <Typography.Caption className={classes.caption}>себестоимость</Typography.Caption>
    </div>
    <div>
      <Typography.Value size="xl">
        <Format>{ margin }</Format>
        ₽
      </Typography.Value>
      <Typography.Caption className={classes.caption}>прибыль</Typography.Caption>
    </div>
  </div>
);

const Summary = ({ table }) => {
  const { summary, top } = table;
  return (
    <SummaryCard>
      <div>
        <div className={classes.title}><Typography.Title level={4}>Общие данные по напиткам</Typography.Title></div>
        <Row earn={summary.earn} cost={summary.cost} margin={summary.margin} />
      </div>
      <div className={classes.top}>
        <div className={classes.title}><Typography.Title level={4}>Топ 5 напитков по прибыли</Typography.Title></div>
        <div>
          {
            top.slice(0, 5).map(({
              id, name, earn, cost, margin,
            }, index) => (
              <div key={id}>
                <div className={classes.name}><Typography.Title level={2}>{`${index + 1} ${name}`}</Typography.Title></div>
                <Row earn={earn} cost={cost} margin={margin} />
              </div>
            ))
          }
        </div>
      </div>
    </SummaryCard>
  );
};

export default inject('table')(observer(Summary));
