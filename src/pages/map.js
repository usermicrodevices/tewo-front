import React from 'react';
import { inject, observer } from 'mobx-react';
import { withSize } from 'react-sizeme';
import { Map as YandexMap, Placemark } from 'react-yandex-maps';

import Loader from 'elements/loader';
import Card from 'elements/card';

const Map = withSize()(inject('session')(observer(({ session, size }) => {
  console.log('rerender');
  const { points } = session;
  const companies = points.rawData.filter(({ location }) => location !== null).map(({ location, id }) => ({ location, id }));
  if (!companies.length) {
    return <Loader />;
  }
  const rect = [companies[0].location.slice(), companies[0].location.slice()];
  for (const { location } of companies) {
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
      height="100%"
      defaultState={{ center, zoom }}
    >
      {
        companies.map(({ location, id }) => <Placemark key={id} geometry={location} />)
      }
    </YandexMap>
  );
})));

const MapWraped = () => (
  <Card title="Карта объектов">
    <Map />
  </Card>
);

export default MapWraped;
