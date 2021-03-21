import React from 'react';
import Chart from 'react-apexcharts';
import { withSize } from 'react-sizeme';

import colors from 'themes/chart';
import NoData from 'elements/noData';

import locale from './locale';
import style from './style.module.scss';
import moment from 'moment';

const LENGTH_LIMIT = 27;

const VIEW_CHART_HEIGHT_PART = 320 / (320 + 130);

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
        fontWeight: 500,
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
  y.forEach(({ axis, name }, id) => {
    if (!axes.has(axis)) {
      axes.set(axis, { name, series: [] });
    }
    axes.get(axis).series.push(id);
  });
  if (!new Set([1, 2]).has(axes.size)) {
    console.error('wrong axes amount');
  }
  const yaxisSides = new Map([...axes.keys()].map((key, id) => [key, provideAxis(id === 0 ? y1 : y2, `y${id}`, id === 1)]));
  const yaxis = y.map(({ axis }) => axis);
  for (const [side, { name, series: itms }] of axes.entries()) {
    const richAxis = yaxisSides.get(side);
    yaxis[itms[0]] = richAxis;
    for (const idx of itms.slice(1)) {
      yaxis[idx] = {
        show: false,
        zoomEnabled: false,
        seriesName: name,
      };
    }
  }
  let tooltip;
  if (moment.isMoment(x[0])) {
    tooltip = {
      custom(args) {
        const { dataPointIndex, series: reduced } = args;
        return `
          <div class="apexcharts-tooltip-title" style="font-family: Inter; font-size: 12px;">${x[dataPointIndex].format('D MMMM')}</div>
          ${reduced.map((values, seriesIndex) => `
            <div class="apexcharts-tooltip-series-group apexcharts-active" style="display: flex;">
              <span class="apexcharts-tooltip-marker" style="background-color: ${colors[seriesIndex]};"></span>
              <div class="apexcharts-tooltip-text" style="font-family: Inter; font-size: 12px;">
                <div class="apexcharts-tooltip-y-group">
                  <span class="apexcharts-tooltip-text-label">${(seriesIndex && x.prw ? x.prw : x)[dataPointIndex].format('D MMMM YYYY')}: </span>
                  <span class="apexcharts-tooltip-text-value">${values[dataPointIndex]}</span>
                </div>
              </div>
            </div>
          `).join('')}`;
      },
    };
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
      fontFamily: 'Inter',
      ...locale,
    },
    navigation: { menuItemStyle: { display: 'none' } },
    colors,
    stroke: {
      width: 2,
      curve: 'smooth',
    },
    exporting: {
      enabled: false,
    },
    xaxis: {
      categories,
      type: 'datetime',
      labels: {
        datetimeUTC: false,
      },
    },
    yaxis,
    tooltip: {
      shared: true,
      x: {
        show: true,
      },
      ...tooltip,
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
      labels: {
        datetimeUTC: false,
      },
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
