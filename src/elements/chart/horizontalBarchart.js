import React from 'react';
import Chart from 'react-apexcharts';
import { withSize } from 'react-sizeme';

const ChartWidget = ({ size }) => {
  const series = [{
    name: 'Вода',
    data: [44, 55, 41, 37, 22, 43, 21],
  }, {
    name: 'Соль',
    data: [53, 32, 33, 52, 13, 43, 32],
  }, {
    name: 'Сахар',
    data: [12, 17, 11, 9, 15, 11, 20],
  }, {
    name: 'Приготовление',
    data: [9, 7, 5, 8, 6, 9, 4],
  }, {
    name: 'Маржа',
    data: [25, 12, 19, 32, 25, 24, 10],
  }];
  const options = {
    chart: {
      type: 'bar',
      height: 350,
      stacked: true,
      fontFamily: 'Inter',
    },
    plotOptions: {
      bar: {
        horizontal: true,
      },
    },
    stroke: {
      width: 1,
      colors: ['#fff'],
    },
    title: {
      text: 'Себестоимость напитков',
    },
    xaxis: {
      categories: ['Латте', 'Мокаччино', 'Кофе с молоком', 'Чай', 'Эспрессо', 'Водка', 'Кокакола'],
      labels: {
        formatter: (val) => val,
      },
    },
    yaxis: {
      title: {
        text: undefined,
      },
    },
    tooltip: {
      y: {
        formatter: (val) => val,
      },
    },
    fill: {
      opacity: 1,
    },
    legend: {
      position: 'top',
      horizontalAlign: 'left',
      offsetX: 40,
    },
  };
  return (
    <Chart
      type="bar"
      series={series}
      width={size.width}
      height={700}
      options={options}
    />
  );
};

export default withSize()(ChartWidget);
