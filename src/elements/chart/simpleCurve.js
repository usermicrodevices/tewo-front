import React from 'react';
import Chart from 'react-apexcharts';

function getChartOptions({ labels, color }) {
  return {
    chart: {
      type: 'line',
      zoom: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
    },
    colors: [color],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
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
      type="line"
      options={options}
      series={series}
      height="100%"
    />
  );
}

export default SimpleCurve;
