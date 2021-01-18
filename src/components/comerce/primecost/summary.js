import React from 'react';
import { inject, observer } from 'mobx-react';

import SummaryCard from 'elements/card/summary';
import Typography from 'elements/typography';
import Format from 'elements/format';
import Loader from 'elements/loader';

import classes from './summary.module.scss';

const Row = ({ earn, cost, margin }) => (
  <div className={classes.row}>
    <div>
      <Typography.Value size="l"><Format isCost>{ earn }</Format></Typography.Value>
      <Typography.Caption className={classes.caption}>выручка</Typography.Caption>
    </div>
    <div>
      <Typography.Value size="l"><Format isCost>{ cost }</Format></Typography.Value>
      <Typography.Caption className={classes.caption}>себестоимость</Typography.Caption>
    </div>
    <div>
      <Typography.Value size="l"><Format isCost>{ margin }</Format></Typography.Value>
      <Typography.Caption className={classes.caption}>прибыль</Typography.Caption>
    </div>
  </div>
);

const Summary = ({ table }) => {
  const { summary, top } = table;
  return (
    <SummaryCard className={classes.whole}>
      <div>
        <div className={classes.title}><Typography.Title level={4}>Общие данные по напиткам</Typography.Title></div>
        <Row earn={summary.earn} cost={summary.cost} margin={summary.margin} />
      </div>
      <div className={classes.top}>
        <div className={classes.title}><Typography.Title level={4}>Рейтинг напитков по прибыли</Typography.Title></div>
        <div>
          {
            top.map(({
              id, name, earn, cost, margin,
            }, index) => (
              <div key={id}>
                <div className={classes.name}><Typography.Text>{`${index + 1}. ${name}`}</Typography.Text></div>
                <Row earn={earn} cost={cost} margin={margin} />
              </div>
            ))
          }
          { top.length === 0 && <Loader /> }
        </div>
      </div>
    </SummaryCard>
  );
};

export default inject('table')(observer(Summary));
