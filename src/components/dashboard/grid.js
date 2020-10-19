import { Provider, inject, observer } from 'mobx-react';
import React from 'react';
import GridLayout from 'react-grid-layout';
import { withSize } from 'react-sizeme';

import { WIDGETS_ADDITIONAL_INFORMATION } from 'services/dashboard';

import Item from './item';
import generateLayout from './layoutGenerator';

import itemStyle from './item.module.scss';

const COLUMNS_MIN_WIDTH = 280;

const picker = (field, citical) => (widgetType) => {
  if (widgetType in WIDGETS_ADDITIONAL_INFORMATION) {
    return WIDGETS_ADDITIONAL_INFORMATION[widgetType][field];
  }
  console.error(`unexpected widget type ${widgetType}`);
  return citical;
};

const colSpan = picker('colSpan', 2);

const rowSpan = picker('rowSpan', 100);

const cardsSwitch = picker('widget', () => 'В разработке');

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
          const Widget = cardsSwitch(item.widgetType);
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
