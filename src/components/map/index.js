import React, {
  useEffect, useState, useCallback, useRef,
} from 'react';
import { inject, observer } from 'mobx-react';
import { YMaps } from 'react-yandex-maps';

import Loader from 'elements/loader';
import Card from 'elements/card';

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

const YMapContainer = inject('session')(observer(({ session }) => {
  const { points } = session;
  const locations = points.rawData.filter(({ mapPoint }) => mapPoint !== null).map(({ location, id }) => ({ location, id }));
  const hasData = points.rawData.length > 0;
  const {
    zoom, center, zoomIn, zoomOut, toggleFullscreen, isFullscreen, onZoom, mapRef,
  } = useMapState(locations);

  if (!hasData) {
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
        <YMap fRef={mapRef} zoom={zoom} center={center} points={locations} onZoom={onZoom} />
      </div>
    </YMaps>
  );
}));

const MapHeader = ({ title }) => (
  <div style={{ fontWeight: 600, fontSize: 42, marginBottom: 24 }}>{title}</div>
);

const MapWraped = () => (
  <Card>
    <MapHeader title="Карта объектов" />
    <YMapContainer />
  </Card>
);

export default MapWraped;
