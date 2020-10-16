import { Provider, inject, observer } from 'mobx-react';
import React from 'react';
import GridLayout from 'react-grid-layout';
import { withSize } from 'react-sizeme';

import { DASHBOARD_WIDGETS_TYPE as WIDGET_TYPES } from 'services/dashboard';

import Item from './item';
import Spidometr from './spidometr';
import Statistic from './statistic';
import HeatmapDeviceStatuses from './heatmapDeviceStatuses';
import generateLayout from './layoutGenerator';
import DiagramPopularity from './diagramPopularity';
import DiagramSalePointsBeveragesRate from './diagramSalePointsBeveragesRate';
import ChartBeveragesSales from './chartBeveragesSales';
import ChartSales from './chartSales';
import ChartBeverages from './chartBeverages';
import DiagramTechState from './diagramTechState';

import itemStyle from './item.module.scss';

const COLUMNS_MIN_WIDTH = 280;

const colSpan = (type) => {
  switch (type) {
    case WIDGET_TYPES.overview:
    case WIDGET_TYPES.chartBeveragesSales:
      return 3;
    case WIDGET_TYPES.speedometerBeverages:
    case WIDGET_TYPES.diagramPopularity:
    case WIDGET_TYPES.chartSales:
    case WIDGET_TYPES.chartBeverages:
      return 1;
    default:
      return 2;
  }
};

const rowSpan = (type) => {
  switch (type) {
    case WIDGET_TYPES.overview:
    case WIDGET_TYPES.speedometerBeverages:
    case WIDGET_TYPES.chartSales:
    case WIDGET_TYPES.chartBeverages:
    case WIDGET_TYPES.heatmapDeviceStatuses:
      return 76;
    case WIDGET_TYPES.chartBeveragesSales:
      return 96;
    case WIDGET_TYPES.diagramTechState:
      return 71;
    case WIDGET_TYPES.diagramPopularity:
      return 118;
    case WIDGET_TYPES.diagramSalePointsBeveragesRate:
      return 124;
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
    case WIDGET_TYPES.speedometerBeverages:
      return Spidometr;
    case WIDGET_TYPES.overview:
      return Statistic;
    case WIDGET_TYPES.chartBeveragesSales:
      return ChartBeveragesSales;
    case WIDGET_TYPES.heatmapDeviceStatuses:
      return HeatmapDeviceStatuses;
    case WIDGET_TYPES.diagramTechState:
      return DiagramTechState;
    case WIDGET_TYPES.diagramPopularity:
      return DiagramPopularity;
    case WIDGET_TYPES.diagramSalePointsBeveragesRate:
      return DiagramSalePointsBeveragesRate;
    case WIDGET_TYPES.chartSales:
      return ChartSales;
    case WIDGET_TYPES.chartBeverages:
      return ChartBeverages;
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
