import React from 'react';
import Chart from 'react-apexcharts';
import { withSize } from 'react-sizeme';

const ChartWidget = ({ size }) => {
  const colors = ['#228148', '#66C7F4', '#142288', '#99C2A2'];
  const dataLength = 8;
  const series = [
    {
      name: 'Наливы',
      type: 'line',
      data: new Array(dataLength).fill(null).map(() => Math.floor(Math.random() * 100 + 100)),
    },
    {
      name: 'Отмены',
      type: 'line',
      data: new Array(dataLength).fill(null).map(() => Math.floor(Math.random() * 100 + 100)),
    },
    {
      name: 'Отмены',
      type: 'line',
      data: new Array(dataLength).fill(200),
    },
    {
      name: 'Отмены',
      type: 'line',
      data: new Array(dataLength).fill(100),
    },
  ];
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
      width: 4,
      curve: 'smooth',
    },
    title: {
      text: 'Количество наливов и отмен',
      align: 'left',
      offsetX: 110,
    },
    xaxis: {
      categories: new Array(dataLength).fill(null).map((_, id) => `${(3 + id) % 31 + 1} ${['июля', 'августа', 'сентября'][Math.floor((3 + id) / 31)]}`),
    },
    yaxis: [
      {
        seriesName: 'Наливы',
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
