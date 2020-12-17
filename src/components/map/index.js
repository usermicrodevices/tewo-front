import React from 'react';
import { inject } from 'mobx-react';

import Card from 'elements/card';
import YMapContainer from 'elements/map';

import MapStorage from 'models/map';

import MapHeader from './mapHeader';

@inject('session')
class MapWraped extends React.Component {
  constructor(props) {
    super(props);

    this.mapStorage = new MapStorage(props.session);
  }

  render() {
    return (
      <Card>
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <MapHeader title="Карта объектов" />
          <YMapContainer storage={this.mapStorage} filter={this.mapStorage.filters} />
        </div>
      </Card>
    );
  }
}

export default MapWraped;
