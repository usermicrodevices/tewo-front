import React from 'react';
import { Card as AntdCard } from 'antd';
import { inject, observer } from 'mobx-react';
import { withSize } from 'react-sizeme';
import { Map as YandexMap, Placemark } from 'react-yandex-maps';

import Loader from 'elements/loader';
import Card from 'elements/card';

const Map = withSize()(inject('session')(observer(({ session, size }) => {
  const { points } = session;
  const locations = points.rawData.filter(({ mapPoint }) => mapPoint !== null).map(({ location, id }) => ({ location, id }));
  if (!locations.length) {
    return (
      <Loader />
    );
  }
  const rect = [locations[0].location.slice(), locations[0].location.slice()];
  for (const { location } of locations) {
    rect[0][0] = Math.min(location[0], rect[0][0]);
    rect[1][0] = Math.max(location[0], rect[1][0]);
    rect[0][1] = Math.min(location[1], rect[0][1]);
    rect[1][1] = Math.max(location[1], rect[1][1]);
  }
  const rib = Math.max(rect[1][0] - rect[0][0], rect[1][1] - rect[0][1]);
  const center = [rect[1][0] + rect[0][0], rect[1][1] + rect[0][1]].map((v) => v / 2);
  const zoom = 12 - Math.ceil(rib / 15);
  return (
    <YandexMap
      width={size.width}
      height="calc(100% - 50px)"
      defaultState={{ center, zoom }}
    >
      {
        locations.map(({ location, id }) => <Placemark key={id} geometry={location} />)
      }
    </YandexMap>
  );
})));

const MapWraped = () => (
  <Card>
    <div style={{ fontWeight: 600, fontSize: 20, marginBottom: 24 }}>Карта объектов</div>
    <Map />
  </Card>
);

export default MapWraped;
