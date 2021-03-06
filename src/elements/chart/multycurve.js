import React from 'react';
import Chart from 'react-apexcharts';
import { withSize } from 'react-sizeme';

import colors from 'themes/chart';
import NoData from 'elements/noData';
import { FORMAT } from 'elements/format';

import locale from './locale';
import style from './style.module.scss';

const provideAxis = (opposite, decimalsInFloat, name, title) => ({
  seriesName: name,
  opposite,
  axisTicks: {
    show: true,
  },
  axisBorder: {
    show: true,
    color: 'black',
  },
  labels: {
    formatter: (v) => {
      if (decimalsInFloat === 0 && Math.round(v) !== v) {
        return null;
      }
      return FORMAT.format(v.toFixed(decimalsInFloat));
    },
    style: {
      color: 'black',
    },
  },
  title: {
    text: title,
    style: {
      color: 'black',
      fontWeight: 500,
    },
  },
  forceNiceScale: true,
  tooltip: {
    enabled: true,
  },
});

const range = (data) => {
  const setRange = { min: data[0], max: data[0] };
  for (const v of data) {
    setRange.min = Math.min(setRange.min, v);
    setRange.max = Math.max(setRange.max, v);
  }
  return setRange;
};

const rangesUnion = (lhs, rhs) => ({
  min: Math.min(lhs.min, rhs.min),
  max: Math.max(lhs.max, rhs.max),
});

const ClearanceChart = ({
  size, x, y, y1, y2,
}) => {
  if (!Array.isArray(x) || !Array.isArray(y) || x.length <= 1 || y.length === 0) {
    return <NoData noMargin title="Недостаточно данных для построения графика" />;
  }
  const categories = x.map((v) => +v);
  const series = y;
  const yaxis = [];
  let yLeft = null;
  let yRight = null;
  const ranges = {};
  for (const { axis, data } of y) {
    if (yLeft === null) {
      yLeft = axis;
      yaxis.push(provideAxis(false, y1.decimalsInFloat, 'y1', y1.text));
      ranges[axis] = range(data);
    } else if (yRight === null && yLeft !== axis) {
      yRight = axis;
      yaxis.push(provideAxis(true, y2.decimalsInFloat, 'y2', y2.text));
      ranges[axis] = range(data);
    } else {
      const isLeft = yLeft === axis;
      const seriesName = isLeft ? 'y1' : 'y2';
      const axisConfig = isLeft
        ? provideAxis(false, y1.decimalsInFloat, 'y1', y1.text)
        : provideAxis(true, y2.decimalsInFloat, 'y2', y2.text);

      yaxis.push({
        ...axisConfig,
        show: false,
        zoomEnabled: false,
        seriesName,
      });
      ranges[axis] = rangesUnion(range(data), ranges[axis]);
    }
  }
  y.forEach(({ axis }, id) => {
    yaxis[id].min = 0;
    yaxis[id].max = ranges[axis].max;
  });
  const width = y.map(({ width: w }) => w);
  const data = {
    colors,
    chart: {
      height: size.height,
      type: 'line',
      stacked: false,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
      fontFamily: 'Inter',
      ...locale,
    },
    dataLabels: {
      enabled: y[0].data.length < 30,
    },
    stroke: {
      width,
      curve: 'smooth',
    },
    xaxis: {
      categories,
      type: 'datetime',
      labels: {
        datetimeUTC: false,
      },
    },
    yaxis,
    legend: {
      horizontalAlign: 'left',
      offsetX: 40,
    },
  };
  return (
    <Chart
      series={series}
      width={size.width}
      height={data.chart.height}
      options={data}
    />
  );
};

const Wrap = withSize()(({
  size: { width }, height, x, y, y1, y2,
}) => (<div className={style.chartwrap}><ClearanceChart x={x} y={y} size={{ width, height }} y1={y1} y2={y2} /></div>));

export default Wrap;
