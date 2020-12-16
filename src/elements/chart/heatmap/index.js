import React from 'react';
import Chart from 'react-apexcharts';

import { getSeries, getHeatmapOptions } from './config';

function Heatmap({
  legend, title, data = [], options, columnsRatio = 3,
  tooltipTemplate, onSelect,
}) {
  const columns = Math.ceil(Math.sqrt(columnsRatio * data.length));
  const series = getSeries(data, columns);
  const heatmapOptions = getHeatmapOptions({
    legend, title, tooltipTemplate, onSelect,
  }, options);

  return (
    <Chart height="100%" width="100%" options={heatmapOptions} series={series} type="heatmap" />
  );
}

export default Heatmap;
