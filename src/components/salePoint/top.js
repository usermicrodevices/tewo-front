import React from 'react';
import { inject, observer } from 'mobx-react';
import { Card } from 'antd';
import { withSize } from 'react-sizeme';

import plural from 'utils/plural';
import Loader from 'elements/loader';
import Format from 'elements/format';
import Typography from 'elements/typography';
import NoData from 'elements/noData';
import { Pie, PIE_COLORS } from 'elements/chart/pie';

import style from './top.module.scss';

const FOUR_MAGIC_NUMBERS = [450, 3, 200, 1.5];

const MAX_DRINKS_AMOUNT = 6;

const Wrap = ({ children }) => (
  <Card className={style.root}>
    <Typography.Title level={3}>Топ продаж</Typography.Title>
    {children}
  </Card>
);

const Top = ({ size: { width }, element: { details: { salesTop } } }) => {
  if (salesTop === null) {
    return <Wrap><div className={style.loadin}><Loader size="large" /></div></Wrap>;
  }
  if (salesTop.length === 0) {
    return (
      <Wrap>
        <div className={style.emergency}>
          <NoData
            title="За указанный период не обнаружено записей о наливах"
            text="Измените дату поиска"
          />
        </div>
      </Wrap>
    );
  }
  const columWidth = (width - FOUR_MAGIC_NUMBERS[0]) / Math.ceil(Math.min(salesTop.length, MAX_DRINKS_AMOUNT) / FOUR_MAGIC_NUMBERS[1]);
  const labelAllowedWidth = (columWidth - FOUR_MAGIC_NUMBERS[2]) * FOUR_MAGIC_NUMBERS[3];
  const series = salesTop.slice(0, MAX_DRINKS_AMOUNT).map(({ beverages }) => beverages);
  const labels = salesTop.slice(0, MAX_DRINKS_AMOUNT).map(({ drinkName }) => drinkName);
  if (salesTop.length > MAX_DRINKS_AMOUNT) {
    series.push(salesTop.slice(MAX_DRINKS_AMOUNT).map(({ beverages }) => beverages).reduce((a, b) => a + b), 0);
    labels.push(`Остальные (${salesTop.length - MAX_DRINKS_AMOUNT})`);
  }
  return (
    <Wrap>
      <div className={style.chart}>
        <Pie
          series={series}
          width={200}
          labels={labels}
        />
      </div>
      <div className={style.list}>
        {
          salesTop.slice(0, MAX_DRINKS_AMOUNT).map(({ drinkName, beverages, drinkId }, index) => (
            <div className={style.item} key={drinkId}>
              <div className={style.label}>
                <div className={style.mark} style={{ backgroundColor: PIE_COLORS[index] }} />
                <Typography.Text><Format width={labelAllowedWidth}>{drinkName}</Format></Typography.Text>
                <Typography.Text className={style.phonetext}><Format width={100}>{drinkName}</Format></Typography.Text>
              </div>
              <div className={style.value}>
                <Typography.Value strong><Format>{beverages}</Format></Typography.Value>
                <Typography.Caption>{plural(beverages, ['налив', 'наливов', 'налива'])}</Typography.Caption>
              </div>
            </div>
          ))
        }
      </div>
    </Wrap>
  );
};

export default withSize()(inject('element')(observer(Top)));
