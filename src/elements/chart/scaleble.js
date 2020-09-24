import React from 'react';
import Chart from 'react-apexcharts';
import { withSize } from 'react-sizeme';
import moment from 'moment';

import Card from 'elements/card';
import colors from 'themes/chart';
import NoData from 'elements/noData';

import style from './style.module.scss';

const LENGTH_LIMIT = 30;

const VIEW_CHART_HEIGHT_PART = 280 / (280 + 130);

const monthMomentExporter = ((format) => {
  const jan = moment().startOf('year');
  return new Array(12).fill(null).map((_, id) => jan.clone().add(id, 'month').format(format).slice(0, -1));
});

const weekMomentExporter = ((format) => {
  const mon = moment().startOf('week');
  return new Array(7).fill(null).map((_, id) => mon.clone().add(id, 'day').format(format));
});

const LOCALE = {
  defaultLocale: 'ru',
  locales: [{
    name: 'ru',
    options: {
      months: monthMomentExporter('MMMM'),
      shortMonths: monthMomentExporter('MMM'),
      days: weekMomentExporter('dd'),
      shortDays: weekMomentExporter('dddd'),
      toolbar: {
        selectionZoom: 'Увеличение',
        zoomIn: 'Приблизить',
        zoomOut: 'Отдалить',
        pan: 'Перетянуть',
        reset: 'Сбросить увеличение',
      },
    },
  }],
};

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
  if (x.length <= 1 || y.length === 0) {
    return <NoData noMargin>Недостаточно данных для построения графика</NoData>;
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
      id: 'chart2',
      height: isHaveOverviewChart ? VIEW_CHART_HEIGHT_PART * height : height,
      ...LOCALE,
      toolbar: {
        show: false,
      },
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
      ...LOCALE,
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

const TestChart = () => {
  const length = 96;
  const series = ['Наливы за текущий период'].map((label) => ({
    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 66, 500, 437, 502, 442, 412, 401, 389, 408, 362, 452, 985, 467, 499, 413, 441, 419, 456, 464, 408, 436, 416, 415, 464, 539, 419, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 111, 728, 372, 0, 0, 0, 409, 471, 450, 526, 442, 551, 415, 428, 553, 492, 631, 594, 648, 565, 616, 581, 650, 562, 696, 660, 589, 419, 547, 526, 187, 0, 0, 0, 0, 0, 0, 0],
    name: label,
    axis: Math.round(Math.random()),
  }));
  const x = new Array(length).fill(null).map((d, id) => +moment() + id * 3600 * 24 * 1000);
  return <Card><Wrap x={x} y={series} height={280 + 130} y1={{ text: 'xxx', decimalsInFloat: 2 }} y2={{ text: 'Динамика продаж', decimalsInFloat: 0 }} /></Card>;
};

export { TestChart, Wrap as default };

