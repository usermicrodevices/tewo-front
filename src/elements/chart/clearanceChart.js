import React from 'react';
import Chart from 'react-apexcharts';
import { withSize } from 'react-sizeme';

import locale from './locale';
import style from './style.module.scss';

const ClearanceChart = withSize()(({ size }) => {
  const colors = ['#228148', '#66C7F4', '#142288', '#99C2A2'];
  const dataLength = 8;
  const caps = new Array(dataLength).fill(null).map((_, id) => Math.floor(Math.random() * 300 + 100));
  const rightAxis = {
    seriesName: 'Фактическое количество очисток',
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
      text: 'Расход чистящих средств',
      style: {
        color: 'black',
      },
    },
    decimalsInFloat: 0,
    tooltip: {
      enabled: true,
    },
  };
  const series = [{
    name: 'Наливы',
    type: 'line',
    data: caps,
  }, {
    name: 'Фактическое число очисток',
    type: 'column',
    data: new Array(dataLength).fill(null).map((_, id) => Math.floor(Math.random() * 3 + 1)),
  }, {
    name: 'Ожидаемое число очисток',
    type: 'column',
    data: caps.map((v) => Math.ceil(v / 400 * 5)),
  }];
  const data = {
    colors,
    chart: {
      height: size.height,
      type: 'line',
      stacked: false,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
      ...locale,
    },
    dataLabels: {
      enabled: [true, false, false],
    },
    stroke: {
      width: [4, 1],
      curve: 'smooth',
    },
    title: {
      text: 'Очисток в день',
      align: 'left',
      offsetX: 110,
    },
    xaxis: {
      categories: new Array(dataLength).fill(null).map((_, id) => `${3 + id} апреля`),
    },
    yaxis: [
      {
        seriesName: 'Наливы',
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
          text: 'Расход чистящих средств',
          style: {
            color: 'black',
          },
        },
      },
      rightAxis,
      {
        show: false,
        seriesName: rightAxis.seriesName,
      },
    ],
    legend: {
      horizontalAlign: 'left',
      offsetX: 40,
    },
  };
  return (
    <Chart
      series={series}
      width={size.width}
      height={data.chart.height}
      options={data}
    />
  );
});

const Wrap = withSize()(({
  size: { width }, height, x, y, y1, y2,
}) => (<div className={style.chartwrap}><ClearanceChart x={x} y={y} size={{ width, height }} y1={y1} y2={y2} /></div>));

export default Wrap;
