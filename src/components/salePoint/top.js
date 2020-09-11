import React from 'react';
import { inject, observer } from 'mobx-react';
import { Card } from 'antd';
import { withSize } from 'react-sizeme';
import Chart from 'react-apexcharts';

import plural from 'utils/plural';
import Loader from 'elements/loader';
import Format from 'elements/format';
import NoData from 'elements/noData';

import style from './top.module.scss';

const COLORS = [
  '#94FBD0',
  '#3791F3',
  '#F4B144',
  '#CCCCCC',
  '#EBCFC0',
  '#B5EE93',
  '#B5CFD0',
];

const FOUR_MAGIC_NUMBERS = [450, 3, 200, 1.5];

const MAX_DRINKS_AMOUNT = 6;

const Wrap = ({ children }) => (
  <Card className={style.root}>
    <div className={style.title}>Топ продаж</div>
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
          <NoData>
            <div className={style.strong}>За указанный период не обнаружено записей о наливах</div>
            <div>Измените дату поиска</div>
          </NoData>
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
  const options = {
    labels,
    colors: COLORS,
    legend: {
      show: false,
    },
  };
  return (
    <Wrap>
      <div className={style.chart}>
        <Chart
          type="pie"
          series={series}
          width={200}
          labels={labels}
          options={options}
        />
      </div>
      <div className={style.list}>
        {
          salesTop.slice(0, MAX_DRINKS_AMOUNT).map(({ drinkName, beverages, drinkId }, index) => (
            <div className={style.item} key={drinkId}>
              <div className={style.label}>
                <div className={style.mark} style={{ backgroundColor: COLORS[index] }} />
                <Format width={labelAllowedWidth}>{drinkName}</Format>
              </div>
              <div className={style.value}>
                <div className={style.number}><Format>{beverages}</Format></div>
                <div className={style.sublabel}>{plural(beverages, ['налив', 'наливов', 'налива'])}</div>
              </div>
            </div>
          ))
        }
      </div>
    </Wrap>
  );
};

export default withSize()(inject('element')(observer(Top)));
