import React, {
  useEffect, useState, useCallback, useRef,
} from 'react';
import { inject, observer, Provider } from 'mobx-react';
import { YMaps } from 'react-yandex-maps';
import {
  Button, Dropdown,
} from 'antd';
import { FilterOutlined } from '@ant-design/icons';

import Filters from 'elements/filters';
import Loader from 'elements/loader';
import Card from 'elements/card';

import MapStorage from 'models/map';

import { getMapBoundaryOptions } from './utils';

import YMap from './yMap';

const MIN_ZOOM = 0;
const MAX_ZOOM = 25;

const useMapState = (points) => {
  const [mapState, setMapState] = useState({ zoom: undefined, center: undefined, isFullscreen: false });
  const mapRef = useRef(null);

  useEffect(() => {
    if (points && points.length && !mapState.zoom && !mapState.center) {
      const { zoom, center } = getMapBoundaryOptions(points);

      setMapState((state) => ({ ...state, zoom, center }));
    }
  }, [points]);

  const onZoom = useCallback((zoom) => {
    setMapState((state) => ({ ...state, zoom }));
  }, []);

  const zoomIn = useCallback(() => {
    setMapState((state) => ({ ...state, zoom: state.zoom < MAX_ZOOM ? state.zoom + 1 : state.zoom }));
  }, []);

  const zoomOut = useCallback(() => {
    setMapState((state) => ({ ...state, zoom: state.zoom > MIN_ZOOM ? state.zoom - 1 : state.zoom }));
  }, []);

  const toggleFullscreen = useCallback(() => {
    setMapState((state) => ({ ...state, isFullscreen: !state.isFullscreen }));
  }, []);

  useEffect(() => {
    if (mapRef.current && mapState.isFullscreen) {
      mapRef.current.fitToViewport();
    }
  }, [mapState.isFullscreen]);

  return {
    zoom: mapState.zoom,
    center: mapState.center,
    isFullscreen: mapState.isFullscreen,

    zoomIn,
    zoomOut,
    onZoom,
    mapRef,
    toggleFullscreen,
  };
};

const YMapContainer = inject('storage', 'filter')(observer(({ storage, filter }) => {
  const { points } = storage;
  const {
    zoom, center, zoomIn, zoomOut, toggleFullscreen, isFullscreen, onZoom, mapRef,
  } = useMapState(points);

  if (!storage.isLoaded) {
    return <Loader />;
  }

  const containerStyles = isFullscreen ? {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
  } : {};

  return (
    <YMaps>
      <div style={{ width: '100%', height: '100%', ...containerStyles }}>
        <button type="button" onClick={zoomIn}>ZoomIn</button>
        <button type="button" onClick={zoomOut}>ZoomOut</button>
        <button type="button" onClick={toggleFullscreen}>FullScreen</button>
        <Dropdown overlay={<Filters />} placement="bottomLeft">
          <Button
            type={filter.search !== '' ? 'primary' : 'default'}
            icon={<FilterOutlined />}
          />
        </Dropdown>
        <YMap fRef={mapRef} zoom={zoom} center={center} points={points} onZoom={onZoom} />
      </div>
    </YMaps>
  );
}));

const MapHeader = ({ title }) => (
  <div style={{ fontWeight: 600, fontSize: 42, marginBottom: 24 }}>{title}</div>
);

@inject('session')
class MapWraped extends React.Component {
  constructor(props) {
    super(props);

    this.mapStorage = new MapStorage(props.session);
  }

  render() {
    return (
      <Card>
        <MapHeader title="Карта объектов" />
        <Provider storage={this.mapStorage} filter={this.mapStorage.filters}>
          <YMapContainer />
        </Provider>
      </Card>
    );
  }
}

export default MapWraped;
