import { Provider } from 'mobx-react';
import React, { useState } from 'react';
import GridLayout from 'react-grid-layout';
import { withSize } from 'react-sizeme';

import DashboardModel from 'models/dashboard';

import Item from './item';

import style from './style.module.scss';

const COLUMNS_MIN_WIDTH = 280;

const cardsSwitch = (widgetType) => {
  switch (widgetType) {
    default:
      return {
        subtitle: () => null,
        widget: () => 'В разработке',
      };
  }
};

const Dashboard = ({
  children, size, storageKey,
}) => {
  const [storage] = useState(new DashboardModel(storageKey));
  const colsAmount = Math.floor(size.width / COLUMNS_MIN_WIDTH);
  return (
    <div className={style.wrapper}>
      <Provider grid={storage}>
        <GridLayout
          width={size.width}
          layout={storage.getLayout(colsAmount)}
          cols={colsAmount}
          margin={[24, 24]}
          draggableHandle={`.${style.anchor}`}
          onLayoutChange={(layout) => { storage.setLayout(colsAmount, layout); }}
        >
          {
            storage.items.map(({
              title, widgetType, settings, key,
            }) => {
              const { widget: Widget, subtitle: Subtitle } = cardsSwitch(widgetType);
              return (
                <Item key={key} title={title} subtitle={<Subtitle settings={settings} />}>
                  <Provider settings={settings}>
                    <Widget />
                  </Provider>
                </Item>
              );
            })
          }
        </GridLayout>
      </Provider>
    </div>
  );
};

export default withSize()(Dashboard);
