import React, {
  useEffect, useState, useCallback, useRef,
} from 'react';
import { withSize } from 'react-sizeme';
import { inject, observer, Provider } from 'mobx-react';
import { YMaps } from 'react-yandex-maps';
import {
  Button, Dropdown,
} from 'antd';
import {
  FilterOutlined, PlusOutlined, MinusOutlined, FullscreenOutlined, FullscreenExitOutlined,
} from '@ant-design/icons';

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

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.fitToViewport();
    }
  }, [mapState.isFullscreen]);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.fitToViewport();
    }
  }, [mapRef]);

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

const YMapContainer = inject('storage', 'filter')(observer(({ storage, filter, size }) => {
  const { points } = storage;
  const {
    zoom, center, zoomIn, zoomOut, toggleFullscreen, isFullscreen, onZoom, mapRef,
  } = useMapState(points);

  if (!storage.isLoaded) {
    return <Loader />;
  }

  const containerStyles = isFullscreen ? {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, borderRadius: '8px', overflow: 'hidden',
  } : { position: 'relative', width: '100%', height: '100%', flex: 1, borderRadius: '8px', overflow: 'hidden', };

  const bottomActionsStyle = {
    display: 'flex', flexDirection: 'column', position: 'absolute', right: '20px', bottom: '40px', zIndex: 1,
  };

  const topActionsStyle = {
    display: 'flex', flexDirection: 'column', position: 'absolute', right: '20px', top: '20px', zIndex: 1,
  };

  const styleBigMargin = { marginBottom: '24px' };
  const styleSmallMargin = { marginBottom: '8px' };

  return (
    <YMaps>
      <div style={containerStyles}>
        <div style={bottomActionsStyle}>
          <Button style={styleSmallMargin} onClick={zoomIn} icon={<PlusOutlined />} />
          <Button style={styleBigMargin} onClick={zoomOut} icon={<MinusOutlined />} />
          <Button onClick={toggleFullscreen} icon={isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />} />
        </div>

        <div style={topActionsStyle}>
          <Dropdown overlay={<Filters />} trigger={['click', 'hover']} placement="bottomRight">
            <Button
              type={filter.search !== '' ? 'primary' : 'default'}
              icon={<FilterOutlined />}
            />
          </Dropdown>
        </div>
        <YMap fRef={mapRef} zoom={zoom} center={center} points={points} onZoom={onZoom} />
      </div>
    </YMaps>
  );
}));

const MapHeader = ({ title }) => (
  <div style={{ fontWeight: 700, fontSize: 30, marginBottom: 24 }}>{title}</div>
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
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <MapHeader title="Карта объектов" />
          <Provider storage={this.mapStorage} filter={this.mapStorage.filters}>
            <YMapContainer />
          </Provider>
        </div>
      </Card>
    );
  }
}

export default MapWraped;
