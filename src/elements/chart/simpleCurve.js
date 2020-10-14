import React from 'react';
import Chart from 'react-apexcharts';

function getChartOptions({ labels }) {
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

function SimpleCurve({ labels = [], data = [], name = '' }) {
  const options = getChartOptions({ labels });
  const series = [{ name, data }];

  return (
    <Chart
      type="line"
      options={options}
      series={series}
    />
  );
}

export default SimpleCurve;
