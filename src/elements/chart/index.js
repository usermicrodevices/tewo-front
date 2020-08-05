import React from 'react';
import Chart from 'react-apexcharts';
import { withSize } from 'react-sizeme';

const ChartWidget = ({ size }) => {
  const dataLength = 2000;
  const series = [
    /*{
      name: 'Количество очисток',
      type: 'column',
      data: new Array(18).fill(null).map((_, id) => Math.floor(Math.random() * id + 5)),
    },*/
    {
      name: 'Продажи',
      type: 'line',
      data: new Array(dataLength).fill(null)
        .map((_, id) => Math.floor((Math.cos(id / 42) + Math.random()) * 10 * (dataLength - id + 10) + (dataLength / 3 + 40) * 25)),
    },
    {
      name: 'Наливы',
      type: 'line',
      data: new Array(dataLength).fill(null).map((_, id) => Math.floor(Math.random() * 10 * id + (id + 40) * 25)),
    },
    {
      name: 'Продажи',
      type: 'line',
      data: new Array(dataLength).fill(null).map((_, id) => Math.floor(Math.random() * 10 * (dataLength) + (-id + dataLength * 2) * 25)),
    },
    {
      name: 'Наливы',
      type: 'line',
      data: new Array(dataLength).fill(null)
        .map((_, id) => Math.floor(Math.random() * 10 * Math.sin(id / 100) * (dataLength - id / 2) + (-id + dataLength / 2 * 3) * 25)),
    },
  ];
  const x = new Array(dataLength).fill(null).map((_, id) => (+new Date()) - (dataLength - id) * 3600 * 24 * 1000);
  const data = {
    chart: {
      height: 350,
      type: 'line',
      stacked: false,
      id: 'chart2',
    },
    dataLabels: {
      enabled: false,
    },
    colors: ['#99C2A2', '#66C7F4', '#228148', '#142288'],
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
        seriesName: 'Наливы',
        axisTicks: {
          show: true,
        },
        axisBorder: {
          show: true,
        },
        title: {
          text: 'Динамика наливов / продаж',
        },
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
      offsetX: 40,
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
          min: new Date().getTime() - 1000 * 3600 * 24 * 30,
          max: new Date().getTime(),
        },
      },
    },
    colors: ['#008FFB'],
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
    yaxis: {
      tickAmount: 2,
    },
  };
  return (
    <h1>
      <div className="mixed-chart">
        <Chart
          series={series}
          width={size.width}
          height={550}
          options={data}
        />
        <Chart
          series={series}
          width={size.width}
          height={130}
          options={data2}
        />
      </div>
    </h1>
  );
};

export default withSize()(ChartWidget);
