import React from 'react';
import Chart from 'react-apexcharts';

const columnsRatio = 3;

function mapDataItem({ name, value }, idx) {
  return {
    x: idx,
    y: value,
  };
}

function getSeries(data, size) {
  const result = [];

  for (let i = 0; i < data.length; i += size) {
    result.push({
      name: i + 1,
      data: data.slice(i, i + size).map(mapDataItem),
    });
  }

  return result;
}

const getHeatmapOptions = ({ legend, title }, options = {}) => ({
  plotOptions: {
    heatmap: {
      colorScale: {
        ranges: legend,
      },
    },
  },
  dataLabels: {
    enabled: false,
  },
  grid: {
    padding: {
      right: 20,
    },
  },
  stroke: {
    show: true,
    width: 2,
    colors: ['#ffffff'],
  },
  title: {
    text: title,
  },
  xaxis: {
    labels: {
      show: false,
    },
  },
  ...options,
});

function Heatmap({
  legend, title, data = [], options,
}) {
  const columns = Math.ceil(Math.sqrt(columnsRatio * data.legnth));
  const series = getSeries(data, columns);
  const heatmapOptions = getHeatmapOptions({ legend, title }, options);

  return (
    <Chart options={heatmapOptions} series={series} type="heatmap" />
  );
}

export default Heatmap;
