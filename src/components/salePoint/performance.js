import React from 'react';
import { inject, observer } from 'mobx-react';
import { Card } from 'antd';
import ReactApexChart from 'react-apexcharts';
import moment from 'moment';

import Loader from 'elements/loader';

import style from './performance.module.scss';

const convertSeries = (data) => new Array(24).fill(null).map((_, hour) => ({
  name: `${hour % 12}${hour >= 12 ? 'pm' : 'am'}`,
  data: new Array(7).fill(null).map((__, day) => data[day][hour]),
}));

const settings = (data) => ({
  series: convertSeries(data),
  options: {
    chart: {
      height: 750,
      type: 'heatmap',
    },
    dataLabels: {
      enabled: true,
      style: {
        colors: ['#FFFFFF'],
      },
    },
    colors: ['#008FFB'],
    title: {
      show: false,
    },
    xaxis: {
      type: 'category',
      position: 'top',
      categories: new Array(7).fill(null).map((_, id) => moment().subtract(6, 'day').add(id, 'day').format('dd')),
    },
    yAxis: {
      opposite: true,
    },
  },
});

const Performance = ({ element: { details: { weekPerformance } } }) => (
  <Card className={style.root}>
    <div className={style.title}>Загруженность</div>
    <div className={style.chart}>
      { weekPerformance
        ? (() => {
          const { options, series } = settings(weekPerformance);
          return <ReactApexChart options={options} series={series} type={options.chart.type} height={options.chart.height} />;
        })()
        : <Loader />}
    </div>
  </Card>
);

export default inject('element')(observer(Performance));
