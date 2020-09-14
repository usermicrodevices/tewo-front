import React from 'react';
import { inject, observer } from 'mobx-react';
import Chart from 'react-apexcharts';
import { withSize } from 'react-sizeme';

import { CURVE_TYPES } from 'models/salePoints/details';

import style from './chart.module.scss';

const COLORS = ['#99C2A2', '#66C7F4', '#228148', '#142288'];

const ChartWidget = ({ size: { width }, element: { details } }) => {
  const series = details.series.map((d) => ({ ...d, type: 'line' }));
  const x = details.xSeria.map((d) => +d);
  const data = {
    chart: {
      type: 'line',
      stacked: false,
      id: 'chart2',
      toolbar: {
        show: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    colors: COLORS,
    stroke: {
      width: 4,
      curve: 'smooth',
    },
    plotOptions: {
      bar: {
        columnWidth: '60%',
      },
    },
    xaxis: {
      categories: x,
      type: 'datetime',
    },
    yaxis: [
      {
        seriesName: 'Продажи за прошлый период',
        axisTicks: {
          show: true,
        },
        axisBorder: {
          show: true,
        },
        title: {
          text: 'Динамика продаж',
        },
      },
      {
        seriesName: 'Наливы за прошлый период',
        opposite: true,
        axisTicks: {
          show: true,
        },
        axisBorder: {
          show: true,
          color: 'black',
        },
        labels: {
          style: {
            color: 'black',
          },
        },
        title: {
          text: 'Наливов в день',
          style: {
            color: 'black',
          },
        },
        tooltip: {
          enabled: true,
        },
      },
      {
        show: false,
        seriesName: 'Продажи за прошлый период',
      },
      {
        show: false,
        seriesName: 'Наливы за прошлый период',
      },
    ],
    tooltip: {
      shared: false,
      intersect: true,
      x: {
        show: false,
      },
    },
    legend: {
      horizontalAlign: 'left',
    },
  };
  const data2 = {
    chart: {
      id: 'chart1',
      height: 130,
      type: 'area',
      brush: {
        target: 'chart2',
        enabled: true,
      },
      selection: {
        enabled: true,
        xaxis: {
          min: x[Math.round(x.length * 0.6)],
          max: x[x.length - 1],
        },
      },
    },
    colors: COLORS,
    fill: {
      type: 'gradient',
      gradient: {
        opacityFrom: 0.91,
        opacityTo: 0.91,
      },
    },
    xaxis: {
      categories: x,
      type: 'datetime',
      tooltip: {
        enabled: false,
      },
    },
    legend: {
      show: false,
    },
    markers: {
      size: 0,
    },
    yaxis: {
      tickAmount: 2,
    },
  };
  return (
    <div className={style.curves}>
      <Chart
        series={series}
        width={width}
        height={280}
        options={data}
      />
      <Chart
        series={series}
        width={width}
        height={130}
        options={data2}
      />
    </div>
  );
};

export default withSize()(inject('element')(observer(ChartWidget)));
