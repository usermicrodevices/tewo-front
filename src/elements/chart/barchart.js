import React from 'react';
import Chart from 'react-apexcharts';
import { withSize } from 'react-sizeme';

import colors from 'themes/chart';
import NoData from 'elements/noData';

import locale from './locale';
import style from './style.module.scss';

const range = (data) => {
  const setRange = { min: data[0], max: data[0] };
  for (const v of data) {
    setRange.min = Math.min(setRange.min, v);
    setRange.max = Math.max(setRange.max, v);
  }
  return setRange;
};

const Barchart = ({
  size, x, y, yAxis,
}) => {
  console.log(x, y);
  if (!Array.isArray(x) || !Array.isArray(y) || x.length <= 1 || y.length === 0) {
    return <NoData noMargin>Недостаточно данных для построения графика</NoData>;
  }
  const categories = x;
  const series = [{
    name: yAxis,
    data: y,
  }];
  const data = {
    colors,
    chart: {
      height: size.height,
      type: 'bar',
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
        columnWidth: '50%',
        endingShape: 'rounded',
      },
    },
    dataLabels: {
      enabled: y.length < 30,
    },
    stroke: {
      width: 2,
    },
    xaxis: {
      labels: {
        rotate: -45,
      },
      categories,
      tickPlacement: 'on',
    },
    yaxis: {
      title: {
        text: yAxis,
      },
    },
    legend: {
      horizontalAlign: 'left',
      offsetX: 40,
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
  size: { width }, height, x, y, yAxis,
}) => (<div className={style.chartwrap}><Barchart x={x} y={y} size={{ width, height }} yAxis={yAxis} /></div>));

export default Wrap;
