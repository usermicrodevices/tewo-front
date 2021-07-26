import React from 'react';
import Chart from 'react-apexcharts';
import { withSize } from 'react-sizeme';

import colors from 'themes/chart';
import NoData from 'elements/noData';
import { FORMAT } from 'elements/format';

import locale from './locale';
import style from './style.module.scss';

const LONG_LIMIT = 15;

const longCrop = (str) => {
  if (typeof str === 'string' && str.length > LONG_LIMIT) {
    return `${str.slice(0, LONG_LIMIT - 2).trim()}…`;
  }
  return str;
};

const Barchart = ({
  size, x, y, yAxis, onSelect, selected,
}) => {
  if (!Array.isArray(x) || !Array.isArray(y) || x.length <= 1) {
    return <NoData noMargin title="Недостаточно данных для построения графика" />;
  }
  const categories = x;
  const series = [{
    name: yAxis,
    data: y,
  }];
  const selectConstoller = ({ el }) => {
    if (typeof selected === 'number' && selected >= 0 && selected < x.length) {
      const selectedPath = el.querySelector(`path[j="${selected}"]`);
      selectedPath.setAttribute('fill', colors[1]);
      selectedPath.setAttribute('stroke', colors[1]);
    }
  };
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

      events: {
        click: onSelect ? ({ target }) => {
          const id = parseInt(target.getAttribute('j'), 10);
          if (isNaN(id)) {
            return;
          }
          if (selected === id) {
            onSelect(null);
          } else {
            onSelect(id, x[id], y[id]);
          }
        } : undefined,
        mounted: selectConstoller,
        updated: selectConstoller,
      },
    },

    tooltip: {
      x: {
        formatter: (id) => x[id - 1],
      },
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
        formatter: longCrop,
      },
      categories,
      tickPlacement: 'on',
    },
    yaxis: {
      title: {
        text: yAxis,
      },
      labels: {
        formatter: (v) => FORMAT.format(v.toFixed(0)),
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
  size: { width }, height, x, y, yAxis, onSelect, selected,
}) => (<div className={style.chartwrap}><Barchart onSelect={onSelect} selected={selected} x={x} y={y} size={{ width, height }} yAxis={yAxis} /></div>));

export default Wrap;
