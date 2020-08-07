import React from 'react';
import Chart from 'react-apexcharts';
import { withSize } from 'react-sizeme';

const ChartWidget = ({ size }) => {
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
    tooltip: {
      enabled: true,
    },
  };
  const series = [{
    name: 'Очистки',
    type: 'line',
    data: caps,
  }, {
    name: 'Фактический расход чистящих средств',
    type: 'column',
    data: new Array(dataLength).fill(null).map((_, id) => Math.floor(Math.random() * 3 + 1)),
  }, {
    name: 'Ожидаемый расход чистящих средств',
    type: 'column',
    data: caps.map((v) => Math.ceil(v / 400 * 5)),
  }];
  const data = {
    colors,
    chart: {
      height: 350,
      type: 'line',
      stacked: false,
    },
    dataLabels: {
      enabled: [true, false, false],
    },
    stroke: {
      width: [4, 1],
      curve: 'smooth',
    },
    title: {
      text: 'Расход чистящих средств',
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
          text: 'Очисток в день',
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
      height={700}
      options={data}
    />
  );
};

export default withSize()(ChartWidget);
