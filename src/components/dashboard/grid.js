import { Provider, inject, observer } from 'mobx-react';
import React from 'react';
import GridLayout from 'react-grid-layout';
import { withSize } from 'react-sizeme';
import { Modal } from 'antd';

import Item from './item';
import { Spidometr, SpidometrTitle } from './spidometr';

import itemStyle from './item.module.scss';

const COLUMNS_MIN_WIDTH = 280;

const cardsSwitch = ({ widgetType }) => {
  switch (widgetType) {
    case 'speedometer':
      return {
        subtitle: SpidometrTitle,
        widget: Spidometr,
      };
    default:
      return {
        subtitle: () => null,
        widget: () => 'В разработке',
      };
  }
};

const Dashboard = ({ size, grid }) => {
  const colsAmount = Math.floor(size.width / COLUMNS_MIN_WIDTH);
  return (
    <>
      <Modal
        title={grid.editingItem !== null && grid.editingItem.title}
        visible={grid.editingItem !== null}
        onOk={() => { grid.updateSettings(null); }}
        onCancel={() => { grid.cancelEditSettings(); }}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
      <GridLayout
        width={size.width}
        layout={grid.getLayout(colsAmount)}
        cols={colsAmount}
        margin={[24, 24]}
        draggableHandle={`.${itemStyle.anchor}`}
        onLayoutChange={(layout) => { grid.setLayout(colsAmount, layout); }}
      >
        {
          grid.items.map((item) => {
            const { widget: Widget, subtitle: Subtitle } = cardsSwitch(item);
            return (
              <Item key={item.key} item={item} subtitle={<Subtitle settings={item.settings} />}>
                <Provider storage={item.storage}>
                  <Widget />
                </Provider>
              </Item>
            );
          })
        }
      </GridLayout>
    </>
  );
};

export default withSize()(inject('grid')(observer(Dashboard)));
