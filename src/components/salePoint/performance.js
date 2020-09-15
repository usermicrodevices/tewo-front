import React from 'react';
import { Card } from 'antd';
import ReactApexChart from 'react-apexcharts';
import moment from 'moment';

import style from './performance.module.scss';

const SETTINGS = {
  series: new Array(24).fill(null).map((_, id) => ({
    name: `${id % 12}${id >= 12 ? 'pm' : 'am'}`,
    data: new Array(7).fill(null).map(() => (1.2 - (Math.random() * Math.random())) * Math.pow(12 - Math.abs(id - 12), 2) + 40),
  })),
  options: {
    chart: {
      height: 750,
      type: 'heatmap',
    },
    dataLabels: {
      enabled: false,
    },
    colors: ['#008FFB'],
    title: {
      show: false,
    },
    xaxis: {
      type: 'category',
      position: 'top',
      categories: new Array(7).fill(null).map((_, id) => moment().add(id, 'day').format('dd')),
    },
    yAxis: [{
      position: 'right',
    }],
  },
};

const Performance = () => (
  <Card className={style.root}>
    <div className={style.title}>Загруженность</div>
    <div id="chart">
      <ReactApexChart options={SETTINGS.options} series={SETTINGS.series} type="heatmap" height={SETTINGS.options.chart.height} />
    </div>
  </Card>
);

export default Performance;
