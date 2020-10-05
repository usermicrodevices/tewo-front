import { Provider, inject, observer } from 'mobx-react';
import React from 'react';
import GridLayout from 'react-grid-layout';
import { withSize } from 'react-sizeme';
import { Modal } from 'antd';
import plural from 'utils/plural';

import Item from './item';
import Spidometr from './spidometr';
import Statistic from './statistic';

import itemStyle from './item.module.scss';

const COLUMNS_MIN_WIDTH = 280;

const SalePointsAnnounce = inject('session')(observer(({ settings: { salePoints } }) => {
  if (!Array.isArray(salePoints) || salePoints.length === 0) {
    return null;
  }
  const { name } = salePoints[0];
  if (salePoints.length === 1) {
    return name;
  }
  const more = salePoints.length - 1;
  return `${name} и ещё ${more} ${plural(more, ['объект', 'объектов', 'объекта'])}`;
}));

const cardsSwitch = ({ widgetType }) => {
  switch (widgetType) {
    case 'speedometer':
      return {
        subtitle: SalePointsAnnounce,
        widget: Spidometr,
      };
    case 'overview':
      return {
        subtitle: SalePointsAnnounce,
        widget: Statistic,
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
