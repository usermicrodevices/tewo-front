import { Provider, inject, observer } from 'mobx-react';
import React from 'react';
import GridLayout from 'react-grid-layout';
import { withSize } from 'react-sizeme';

import Item from './item';
import Spidometr from './spidometr';
import Statistic from './statistic';
import generateLayout from './layoutGenerator';
import ChartBeveragesSales from './chartBeveragesSales';

import itemStyle from './item.module.scss';

const COLUMNS_MIN_WIDTH = 280;

const colSpan = (type) => {
  switch (type) {
    case 'overview': case 'chartBeveragesSales': return 3;
    case 'speedometerBeverages': return 1;
    default: return 2;
  }
};

const rowSpan = (type) => {
  switch (type) {
    case 'overview':
    case 'speedometerBeverages':
      return 76;
    case 'chartBeverages':
      return 74;
    case 'chartBeveragesSales':
      return 96;
    case 'heatmapDeviceStatuses':
      return 80;
    default:
      console.error('row span not defined for', type);
      return 100;
  }
};

const dressLayout = (layout, widgets, columnsAmount) => {
  const result = [];
  for (const { uid, widgetType } of widgets) {
    result.push({
      i: uid,
      w: colSpan(widgetType),
      h: rowSpan(widgetType),
    });
  }
  const finalLayout = Array.isArray(layout) && layout.length >= widgets.length
    ? layout
    : generateLayout(layout, result, columnsAmount);
  for (let i = 0; i < result.length; i += 1) {
    result[i].x = finalLayout[i].x;
    result[i].y = finalLayout[i].y;
  }
  return result;
};

const cardsSwitch = ({ widgetType }) => {
  switch (widgetType) {
    case 'speedometerBeverages':
      return Spidometr;
    case 'overview':
      return Statistic;
    case 'chartBeveragesSales':
      return ChartBeveragesSales;
    default:
      return () => 'В разработке';
  }
};

const Dashboard = ({ size, grid }) => {
  const colsAmount = Math.floor(size.width / COLUMNS_MIN_WIDTH);
  const { widgets } = grid;
  const layout = dressLayout(grid.getLayout(colsAmount), widgets, colsAmount);
  return (
    <GridLayout
      width={size.width}
      layout={layout}
      cols={colsAmount}
      margin={[0, 0]}
      draggableHandle={`.${itemStyle.anchor}`}
      onLayoutChange={(newLayout) => { grid.setLayout(colsAmount, newLayout); }}
      rowHeight={5}
    >
      {
        widgets.map((item) => {
          const Widget = cardsSwitch(item);
          return (
            <Item key={item.uid} item={item}>
              <Provider storage={item.storage}>
                <Widget />
              </Provider>
            </Item>
          );
        })
      }
    </GridLayout>
  );
};

export default withSize()(inject('grid')(observer(Dashboard)));
