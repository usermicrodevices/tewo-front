import React, {
  useRef, useCallback, useImperativeHandle,
} from 'react';
import PropTypes from 'prop-types';
import { Map as YandexMap, Placemark, Clusterer } from 'react-yandex-maps';

// Presets: error – islands#redDotIcon, warning – islands#darkOrangeDotIcon, success – islands#darkGreenDotIcon

const yMapStyle = {
  borderRadius: '8px', height: '100%', width: '100%', overflow: 'hidden',
};

const yMapModules = ['geoObject.addon.balloon', 'geoObject.addon.hint'];

const clusterDefaultOptions = {
  preset: 'islands#darkBlueClusterIcons',
};

function YMapPoint({ id, location }) {
  return (
    <Placemark
      properties={{
        clusterCaption: `Объект № ${id}`,
        balloonContentBody: `Описание объекта № ${id}`,
      }}
      geometry={location}
      options={{ preset: 'islands#darkGreenDotIcon' }}
    />
  );
}

function YMapCluster({ points, options }) {
  return (
    <Clusterer options={options}>
      {
        points.map(({ id, location }) => (
          <YMapPoint key={id} id={id} location={location} />
        ))
      }
    </Clusterer>
  );
}

function YMap({
  points, center, zoom, onZoom, fRef,
}) {
  const mapRef = useRef(null);

  useImperativeHandle(fRef, () => ({
    fitToViewport: () => mapRef.current.container.fitToViewport(),
  }));

  const initInstanceRef = useCallback((map) => {
    if (map && mapRef.current !== map) {
      mapRef.current = map;

      mapRef.current.events.add('boundschange', (e) => {
        if (e.get('newZoom') !== e.get('oldZoom')) {
          onZoom(e.get('newZoom'));
        }
      });
    }
  }, []);

  return (
    <YandexMap
      instanceRef={initInstanceRef}
      style={yMapStyle}
      defaultState={{ modules: yMapModules }}
      state={{ center, zoom }}
    >
      <YMapCluster options={clusterDefaultOptions} points={points} />
    </YandexMap>
  );
}

YMap.defaultProps = {
  points: [],
  zoom: 13,
  center: [0, 0],
  onZoom: () => {},
};

YMap.propTypes = {
  points: PropTypes.arrayOf(PropTypes.shape({
    location: PropTypes.arrayOf(PropTypes.number),
    name: PropTypes.string,
    id: PropTypes.number,
  })),
  zoom: PropTypes.number,
  center: PropTypes.arrayOf(PropTypes.number),
  onZoom: PropTypes.func,
};

export default YMap;
