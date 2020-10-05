import React from 'react';
import { inject, observer } from 'mobx-react';
import { Card } from 'antd';
import ReactApexChart from 'react-apexcharts';
import moment from 'moment';

import Loader from 'elements/loader';
import { gradient } from 'utils/color';

import style from './performance.module.scss';

const convertSeries = (data) => new Array(24).fill(null).map((_, hour) => ({
  name: `${hour % 12}${hour >= 12 ? 'pm' : 'am'}`,
  data: new Array(7).fill(null).map((__, day) => data[day][hour]),
}));

const colorRanges = (scale, data, textScale) => {
  const max = Math.max(...data.map((v) => Math.max(...v)));
  const min = 0;
  const steps = max - min;
  if (min === max) {
    return [{
      from: min - 1,
      to: min + 1,
      color: scale(0),
      foreColor: textScale(0),
    }];
  }
  return new Array(steps).fill(null).map((_, id) => ({
    from: id,
    to: id + 1,
    color: scale(id / (steps - 1)),
    foreColor: textScale(Math.floor(Math.ceil((id / (steps - 1)) * 3) / 2)),
  }));
};

const settings = (data) => ({
  series: convertSeries(data),
  options: {
    chart: {
      height: 750,
      type: 'heatmap',
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      heatmap: {
        enableShades: false,
        colorScale: {
          ranges: colorRanges(gradient('#D5E2F9', '#3265CB'), data, gradient('#3265CB', '#E5F2FF')),
          min: 0,
          max: 100,
        },
      },
    },
    dataLabels: {
      enabled: true,
      style: {
        colors: ['#FFFFFF'],
      },
    },
    legend: {
      show: false,
    },
    title: {
      show: false,
    },
    tooltip: {
      shared: false,
      intersect: true,
      x: {
        show: false,
      },
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
