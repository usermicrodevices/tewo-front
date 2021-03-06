import React, {
  useRef, useCallback, useImperativeHandle,
  useEffect,
} from 'react';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import {
  YMaps, Map as YandexMap, Placemark, Clusterer,
} from 'react-yandex-maps';

const getPresetByState = (state) => {
  switch (state) {
    case 4: return 'islands#blackDotIcon';
    case 3: return 'islands#redDotIcon';
    case 2: return 'islands#darkOrangeDotIcon';
    default: return 'islands#darkGreenDotIcon';
  }
};

const yMapStyle = {
  width: '100%',
  height: '100%',
};

const clusterDefaultOptions = {
  preset: 'islands#darkBlueClusterIcons',
  minClusterSize: 3,
};

const mapDefaultOptions = {
  suppressMapOpenBlock: true,
};

function getContentBody({ values, id }) {
  const infoRows = values.filter((v) => v.value).map((v) => `<li><b>${v.title}</b>: ${v.value}</li>`).join('');
  const info = `<ul>${infoRows}</ul>`;
  const pointClickScript = `window.dispatchEvent(new CustomEvent('map:point:click', {detail: {id: ${id}}}))`;
  const actions = `<div style="margin-bottom: 8px;"><button class="ant-btn" onclick="${pointClickScript}">Полная информация</button></div>`;

  return `<div>${info}${actions}</div>`;
}

function YMapPoint({
  id, location, state, name, values,
}) {
  return (
    <Placemark
      properties={{
        hintContent: `${name} (№ ${id})`,
        clusterCaption: `${name} (№ ${id})`,
        balloonContentHeader: `${name} (№ ${id})`,
        balloonContentBody: getContentBody({ values, id }),
      }}
      geometry={location}
      options={{ preset: getPresetByState(state) }}
    />
  );
}

const YMapCluster = observer(({ points, options }) => (
  <Clusterer options={options}>
    {
        points.map(({
          id, location, state, name, values,
        }) => (
          <YMapPoint
            key={id}
            id={id}
            location={location}
            state={state}
            name={name}
            values={values}
          />
        ))
      }
  </Clusterer>
));

function YMap({
  points, center, zoom, onZoom, onInfoShow, fRef, height,
}) {
  const mapRef = useRef(null);

  useEffect(() => {
    function onMapPointClick(e) {
      const { id } = e.detail;

      onInfoShow({ id });
    }

    window.addEventListener('map:point:click', onMapPointClick);

    return () => {
      window.removeEventListener('map:point:click', onMapPointClick);
    };
  }, [onInfoShow]);

  const setCenter = useCallback(() => {
    setTimeout(() => {
      if (mapRef.current && mapRef.current.geoObjects && mapRef.current.geoObjects.getBounds()) {
        mapRef.current.setBounds(mapRef.current.geoObjects.getBounds(), { checkZoomRange: true, zoomMargin: 9 });
      }
    }, 500);
  }, []);

  const initInstanceRef = useCallback((map) => {
    if (map && mapRef.current !== map) {
      mapRef.current = map;

      mapRef.current.events.add('boundschange', (e) => {
        if (e.get('newZoom') !== e.get('oldZoom')) {
          onZoom(e.get('newZoom'));
        }
      });
    }
  }, [onZoom]);

  useImperativeHandle(fRef, () => ({
    fitToViewport: () => mapRef.current && mapRef.current.container.fitToViewport(),
    setCenter,
  }));

  return (
    <YMaps
      query={{
        ns: 'use-load-option',
        load: 'Map,Placemark,clusterer.addon.hint,clusterer.addon.balloon,geoObject.addon.balloon,geoObject.addon.hint',
      }}
    >
      <YandexMap
        instanceRef={initInstanceRef}
        style={yMapStyle}
        height={height}
        state={{ center, zoom }}
        options={mapDefaultOptions}
      >
        <YMapCluster options={clusterDefaultOptions} points={points} />
      </YandexMap>
    </YMaps>
  );
}

YMap.defaultProps = {
  points: [],
  zoom: 13,
  center: [0, 0],
  onZoom: () => {},
  onInfoShow: () => {},
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
  onInfoShow: PropTypes.func,
};

export default YMap;
