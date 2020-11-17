import React, {
  useEffect, useState, useCallback, useRef,
} from 'react';
import { inject, observer, Provider } from 'mobx-react';
import { Button, Dropdown } from 'antd';
import {
  FilterOutlined, PlusOutlined, MinusOutlined, FullscreenOutlined, FullscreenExitOutlined,
} from '@ant-design/icons';

import Filters from 'elements/filters';
import Loader from 'elements/loader';
import Card from 'elements/card';

import MapStorage from 'models/map';

import { getMapBoundaryOptions } from './utils';

import YMap from './yMap';
import ActionsContainer from './actions';
import MapContainer from './mapContainer';
import MapHeader from './mapHeader';
import SalePointInfoModal from './salePointInfoModal';

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
    zoom, center, zoomIn, zoomOut, isFullscreen, onZoom, toggleFullscreen, mapRef,
  } = useMapState(points);

  const onShowInfo = useCallback(({ id }) => {
    storage.showPointInfo(id);
  }, []);

  const onHideInfo = useCallback(() => {
    storage.hidePointInfo();
  }, []);

  if (!storage.isLoaded) {
    return <Loader />;
  }

  return (
    <MapContainer isFullscreen={isFullscreen}>
      <ActionsContainer position="bottomRight">
        <ActionsContainer.Group>
          <Button onClick={zoomIn} icon={<PlusOutlined />} />
          <Button onClick={zoomOut} icon={<MinusOutlined />} />
        </ActionsContainer.Group>
        <ActionsContainer.Group>
          <Button icon={isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />} onClick={toggleFullscreen} />
        </ActionsContainer.Group>
      </ActionsContainer>

      <ActionsContainer position="topRight">
        <Dropdown overlay={<Filters />} trigger={['click', 'hover']} placement="bottomRight">
          <Button
            type={filter.search !== '' ? 'primary' : 'default'}
            icon={<FilterOutlined />}
          />
        </Dropdown>
      </ActionsContainer>

      <YMap
        fRef={mapRef}
        zoom={zoom}
        center={center}
        points={points}
        onZoom={onZoom}
        onInfoShow={onShowInfo}
      />

      <SalePointInfoModal
        salePoint={storage.selectedPoint}
        visible={storage.isInfoModalShown}
        onCancel={onHideInfo}
      />
    </MapContainer>
  );
}));

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
