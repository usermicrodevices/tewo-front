import React from 'react';
import { inject, observer } from 'mobx-react';

import MapComponent from 'elements/map';

function MapWidget({ storage }) {
  return (
    <MapComponent storage={storage.mapStorage} fullscreenEnabled={false} />
  );
}

export default inject('storage')(observer(MapWidget));
