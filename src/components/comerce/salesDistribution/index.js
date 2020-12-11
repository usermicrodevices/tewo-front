import React from 'react';
import { inject, observer } from 'mobx-react';
import { Card as AntdCatd } from 'antd';

import Card from 'elements/card';
import Table from 'elements/table';
import Format from 'elements/format';
import { Pie, PIE_COLORS } from 'elements/chart/pie';
import Typography from 'elements/typography';
import Badge from 'elements/badged';

import classes from './index.module.scss';

const COLUMN_NOTES_AMOUNT = 6;

const Label = ({ value, caption }) => (
  <div>
    <Typography.Value><Format>{ value }</Format></Typography.Value>
    <Typography.Caption>{ caption }</Typography.Caption>
  </div>
);

const toLabel = (offset) => (({ drinkName, drinkId, beverages }, id) => (
  <div key={drinkId}>
    <Badge size={11} stateColor={PIE_COLORS[id + offset]}>
      <Typography.Text><Format>{drinkName}</Format></Typography.Text>
    </Badge>
    <Typography.Value><Format>{beverages}</Format></Typography.Value>
  </div>
));

const sum = (data) => {
  let result = 0;
  for (const { beverages } of data) {
    result += beverages;
  }
  return result;
};

const SalesDistrib = ({
  table: {
    sort, data: indirectData,
  },
}) => {
  const isInverseSort = sort.direction === 'ascend';
  const data = isInverseSort ? indirectData.slice().reverse() : indirectData;
  const series = [
    ...data.slice(0, COLUMN_NOTES_AMOUNT * 2),
    ...(data.length > COLUMN_NOTES_AMOUNT * 2 ? [{ beverages: sum(data.slice(COLUMN_NOTES_AMOUNT * 2)) }] : []),
  ].map(({ beverages }) => beverages);
  const labels = [...data.slice(0, COLUMN_NOTES_AMOUNT * 2), { drinkName: 'Остальные' }].map(({ drinkName }) => drinkName || '');
  return (
    <>
      <AntdCatd className={classes.chart}>
        <div className={classes.kernel}>
          <Pie
            series={series}
            width={400}
            labels={labels}
          />
          <div className={classes.list}>
            { data.slice(0, COLUMN_NOTES_AMOUNT).map(toLabel(0)) }
          </div>
          { data.length > COLUMN_NOTES_AMOUNT && (
            <div className={classes.list}>
              { data.slice(COLUMN_NOTES_AMOUNT, COLUMN_NOTES_AMOUNT * 2).map(toLabel(COLUMN_NOTES_AMOUNT)) }
            </div>
          ) }
        </div>
      </AntdCatd>
      <Card><Table /></Card>
    </>
  );
};

export default inject('table')(observer(SalesDistrib));
