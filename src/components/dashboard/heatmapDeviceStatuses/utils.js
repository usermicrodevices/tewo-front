import React from 'react';
import ReactDOMServer from 'react-dom/server';

import Typography from 'elements/typography';

import classnames from './index.module.scss';

export const legend = [
  {
    from: 1,
    to: 1,
    name: 'Активно',
    color: '#00A100',
  },
  {
    from: 2,
    to: 2,
    name: 'Требуется обслуживание',
    color: '#FFB200',
  },
  {
    from: 3,
    to: 3,
    name: 'Выключено',
    color: '#ed3333',
  },
  {
    from: 4,
    to: 4,
    name: 'Неактивно',
    color: '#a1a3a5',
  },
];

export const getItemFromChartEvent = ({
  series, seriesIndex, dataPointIndex, w,
}) => w.config.series[seriesIndex].data[dataPointIndex];

export const Tooltip = ({ name }) => (
  <div className={classnames.tooltip}>
    <Typography.Text>{name}</Typography.Text>
  </div>
);

export const createTooltip = ({ onChange, chartData }) => (chartEvent) => {
  const item = getItemFromChartEvent(chartEvent);

  return ReactDOMServer.renderToString(<Tooltip name={item.name} />);
};
