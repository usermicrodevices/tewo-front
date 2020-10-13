import React, { useCallback, useState } from 'react';
import ReactDOMServer from 'react-dom/server';
import { inject, observer } from 'mobx-react';
import { Modal } from 'antd';

import Heatmap from 'elements/chart/heatmap/index';
import Loader from 'elements/loader';

import classnames from './index.module.scss';

const legend = [
  {
    from: 1,
    to: 1,
    name: 'Активно',
    color: '#00A100',
  },
  {
    from: 2,
    to: 2,
    name: 'Предупреждение',
    color: '#FFB200',
  },
  {
    from: 3,
    to: 3,
    name: 'Ошибка',
    color: '#FF0000',
  },
];

const Tooltip = ({ name, salePoint, isOn }) => (
  <div>
    <h3>{name}</h3>
  </div>
);

const createTooltip = ({ onChange, chartData }) => ({
  series, seriesIndex, dataPointIndex, w,
}) => ReactDOMServer.renderToString(<Tooltip name="Оборудование" salePoint="Точка продаж" isOn />);

const Chart = inject('storage')(observer(({
  storage,
}) => {
  const { isLoaded, chartData } = storage;
  const [selected, setSelected] = useState(null);
  const tooltip = useCallback(createTooltip({ chartData }), [chartData]);

  if (!isLoaded) {
    return <Loader size="large" />;
  }

  return (
    <div className={classnames.root}>
      <Heatmap
        onSelect={(event, chartContext, config) => {
          const { w, seriesIndex, dataPointIndex } = config;
          setSelected(w.config.series[seriesIndex].data[dataPointIndex].x);
        }}
        legend={legend}
        data={chartData}
        tooltipTemplate={tooltip}
      />

      <Modal visible={Boolean(selected)} onCancel={() => setSelected(null)} onOk={() => setSelected(null)}>
        <div>
          {selected}
        </div>
      </Modal>
    </div>
  );
}));

export default Chart;
