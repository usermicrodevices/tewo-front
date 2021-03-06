import React from 'react';
import Chart from 'react-apexcharts';

function getChartOptions({ labels, color }) {
  return {
    chart: {
      zoom: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
      fontFamily: 'Inter',
    },
    colors: [color],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
      width: 3,
    },
    grid: {
      show: false,
    },
    xaxis: {
      categories: labels,
      type: 'datetime',
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        show: false,
        datetimeUTC: false,
      },
    },
    yaxis: {
      labels: {
        show: false,
      },
    },
  };
}

function SimpleCurve({
  labels = [], data = [], name = '', color = '#0180E1',
}) {
  const options = getChartOptions({ labels, color });
  const series = [{ name, data }];

  return (
    <Chart
      type="area"
      options={options}
      series={series}
      height="100%"
    />
  );
}

export default SimpleCurve;
