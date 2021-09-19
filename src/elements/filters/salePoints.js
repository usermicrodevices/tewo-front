import React from 'react';
import { inject, observer } from 'mobx-react';
import { Button } from 'antd';
import Icon from 'elements/icon';
import classnames from 'classnames';
import Selector from './select';

import cn from './salePoints.module.scss';

export default inject('session')(observer(({
  session, minWidth, disabled, onChange, value,
}) => {
  const favorites = session.points.rawData.filter(({ isFavorite }) => isFavorite).map(({ id }) => id);
  const selected = new Set(Object.values(value ?? {}));
  const notSelectedFavorites = favorites.filter((id) => !selected.has(id));
  const isAllSelected = notSelectedFavorites.length === 0;
  const setFavorites = () => {
    if (isAllSelected) {
      const favoritesSet = new Set(favorites);
      onChange(value.filter((id) => !favoritesSet.has(id)));
    } else {
      onChange((Array.isArray(value) ? value : []).concat(notSelectedFavorites));
    }
  };
  return (
    <div className={classnames(favorites.length && cn.wrap)}>
      <Selector
        minWidth={minWidth}
        disabled={disabled}
        onChange={onChange}
        value={value !== null ? value : []}
        title="Объект"
        selector={session.points.selector}
      />
      { Boolean(favorites.length) && <Button type="text" onClick={setFavorites} icon={<Icon name={`star${isAllSelected ? '' : '-outline'}`} />} /> }
    </div>
  );
}));
