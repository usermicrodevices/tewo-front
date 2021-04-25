import React from 'react';
import Chart from 'react-apexcharts';
import { withSize } from 'react-sizeme';

import colors from 'themes/chart';
import NoData from 'elements/noData';
import locale from 'elements/chart/locale';
import Loader from 'elements/loader';
import { FORMAT } from 'elements/format';

const PrimecostChart = ({
  size, chart,
}) => {
  if (typeof chart === 'undefined') {
    return <Loader size="large" />;
  }
  const { categories, series } = chart;
  if (categories.length === 0) {
    return <NoData noMargin title="Недостаточно данных для построения графика" />;
  }

  const sums = [];
  for (const { data } of Object.values(series)) {
    while (sums.length < data.length) {
      sums.push(0);
    }
    for (const [id, v] of data.entries()) {
      sums[id] += v;
    }
    for (let i = 0; i < data.length; i += 1) {
      data[i] = Math.round(data[i]);
    }
  }

  const formatter = (v) => `${v && FORMAT.format(v.toFixed(0))} ₽`;

  const data = {
    colors,
    chart: {
      height: size.height,
      type: 'bar',
      stacked: true,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
      ...locale,
    },
    plotOptions: {
      bar: {
        horizontal: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: 2,
    },
    xaxis: {
      categories,
      labels: { formatter },
    },
    yaxis: {
      title: {
        text: undefined,
      },
    },
    fill: {
      opacity: 1,
    },
    legend: {
      horizontalAlign: 'left',
      offsetX: 40,
    },
    tooltip: {
      y: {
        formatter,
      },
    },
  };
  return (
    <Chart
      type="bar"
      series={series}
      width={size.width}
      height={data.chart.height}
      options={data}
    />
  );
};

const Wrap = withSize()(({
  size: { width }, chart,
}) => (
  <PrimecostChart size={{ width: width - 50, height: 403 }} chart={chart} />
));

export default Wrap;
