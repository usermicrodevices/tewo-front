import React from 'react';
import Chart from 'react-apexcharts';
import { withSize } from 'react-sizeme';

import colors from 'themes/chart';
import NoData from 'elements/noData';

import locale from './locale';
import style from './style.module.scss';

const LENGTH_LIMIT = 30;

const VIEW_CHART_HEIGHT_PART = 280 / (280 + 130);

const provideAxis = (name, seriesName, opposite) => (
  {
    decimalsInFloat: name.decimalsInFloat,
    seriesName,
    opposite,
    axisBorder: {
      show: true,
      color: 'black',
    },
    labels: {
      style: {
        color: 'black',
      },
    },
    title: {
      text: name.text,
      style: {
        color: 'black',
      },
    },
  }
);

const ScalebleChart = ({
  size: { width, height },
  y, x,
  y1, y2,
}) => {
  if (!Array.isArray(x) || !Array.isArray(y) || x.length <= 1 || y.length === 0) {
    return <NoData noMargin title="Недостаточно данных для построения графика" />;
  }
  const categories = x.map((v) => +v);
  const series = y.map(({ name, data }) => ({ name, data, type: 'line' }));
  const isHaveOverviewChart = x.length > LENGTH_LIMIT;
  const axes = new Map();
  y.forEach(({ axis }, id) => {
    if (!axes.has(axis)) {
      axes.set(axis, []);
    }
    axes.get(axis).push(id);
  });
  if (axes.size !== 1 && axes.size !== 2) {
    console.error('wrong axes amount');
  }
  const yaxisSides = new Map([...axes.keys()].map((key, id) => [key, provideAxis(id === 0 ? y1 : y2, `y${id}`, id === 1)]));
  const yaxis = y.map(({ axis }) => axis);
  for (const [side, itms] of axes.entries()) {
    const richAxis = yaxisSides.get(side);
    yaxis[itms[0]] = richAxis;
    for (const idx of itms.slice(1)) {
      yaxis[idx] = {
        show: false,
        zoomEnabled: false,
        seriesName: richAxis.seriesName,
      };
    }
  }
  const data = {
    chart: {
      type: 'line',
      zoom: {
        enabled: false,
      },
      stacked: false,
      toolbar: {
        show: false,
      },
      id: 'chart2',
      height: isHaveOverviewChart ? VIEW_CHART_HEIGHT_PART * height : height,
      ...locale,
    },
    navigation: { menuItemStyle: { display: 'none' } },
    colors,
    stroke: {
      width: 4,
      curve: 'smooth',
    },
    exporting: {
      enabled: false,
    },
    xaxis: {
      categories,
      type: 'datetime',
    },
    yaxis,
    tooltip: {
      shared: false,
      intersect: true,
      x: {
        show: false,
      },
    },
    legend: {
      horizontalAlign: 'left',
      showForSingleSeries: true,
    },
  };
  const data2 = {
    chart: {
      id: 'chart1',
      height: (1 - VIEW_CHART_HEIGHT_PART) * height,
      brush: {
        target: 'chart2',
        enabled: true,
      },
      ...locale,
      selection: {
        enabled: true,
        xaxis: {
          min: categories[Math.round(x.length * 0.6)],
          max: categories[x.length - 1],
        },
      },
    },
    colors,
    xaxis: {
      categories,
      type: 'datetime',
      tooltip: {
        enabled: false,
      },
    },
    legend: {
      show: false,
    },
    yaxis: {
      show: false,
    },
  };
  return (
    <>
      <Chart
        series={series}
        width={width}
        height={data.chart.height}
        options={data}
      />
      {isHaveOverviewChart && (
        <Chart
          series={series}
          width={width}
          height={data2.chart.height}
          options={data2}
        />
      )}
    </>
  );
};

const Wrap = withSize()(({
  size: { width }, height, x, y, y1, y2,
}) => (<div className={style.chartwrap}><ScalebleChart x={x} y={y} size={{ width, height }} y1={y1} y2={y2} /></div>));

export { Wrap as default };
