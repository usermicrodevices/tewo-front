import React from 'react';
import { inject, observer } from 'mobx-react';

import SummaryCard from 'elements/card/summary';
import Typography from 'elements/typography';
import Format from 'elements/format';
import { PIE_COLORS } from 'elements/chart/pie';
import Badge from 'elements/badged';

import classes from './summary.module.scss';

const Summary = ({ table, session }) => {
  const { canceledBeveragesAmount, wholeBeveragesAmount, top } = table;
  return (
    <SummaryCard>
      <div className={classes.sum}>
        <div>
          <Typography.Value size="xl"><Format>{canceledBeveragesAmount}</Format></Typography.Value>
          <Typography.Caption>количество отменённых напитков</Typography.Caption>
        </div>
        <div>
          <Typography.Value size="xl"><Format>{wholeBeveragesAmount}</Format></Typography.Value>
          <Typography.Caption>общее количество напитков</Typography.Caption>
        </div>
      </div>
      <div className={classes.top}>
        <div className={classes.title}><Typography.Title level={4}>Топ 5 отменённых напитков</Typography.Title></div>
        { top && (
          <div className={classes.list}>
            {
              top.slice(0, 5).map(({ drinkId, beverages }, id) => (
                <div key={drinkId}>
                  <Badge size={11} stateColor={PIE_COLORS[id]}><Typography.Text>{ session.drinks.get(drinkId)?.name }</Typography.Text></Badge>
                  <Typography.Value><Format>{beverages}</Format></Typography.Value>
                </div>
              ))
            }
          </div>
        ) }
      </div>
    </SummaryCard>
  );
};

export default inject('table', 'session')(observer(Summary));
