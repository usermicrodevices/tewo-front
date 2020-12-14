import React from 'react';

import Chart from 'react-apexcharts';

const PIE_COLORS = [
  '#94FBD0',
  '#3791F3',
  '#F4B144',
  '#CCCCCC',
  '#EBCFC0',
  '#B5EE93',
  '#94D0FB',
  '#37F391',
  '#B1F444',
  '#F33791',
  '#CFEBC0',
  '#93B5EE',
  '#CFD0B5',
];

const Pie = ({ series, labels, width }) => (
  <Chart
    type="pie"
    series={series}
    width={width}
    labels={labels}
    options={{
      labels,
      colors: PIE_COLORS,
      chart: {
        fontFamily: 'Inter',
      },
      legend: {
        show: false,
      },
    }}
  />
);

export { Pie, PIE_COLORS };
