import React from 'react';
import Chart from 'react-apexcharts';
import { withSize } from 'react-sizeme';

import colors from 'themes/chart';
import NoData from 'elements/noData';

import locale from './locale';
import style from './style.module.scss';

const Barchart = ({
  size, x, y, yAxis,
}) => {
  if (!Array.isArray(x) || !Array.isArray(y) || x.length <= 1) {
    return <NoData noMargin text="Недостаточно данных для построения графика" />;
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
