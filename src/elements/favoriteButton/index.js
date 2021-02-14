import React from 'react';
import { Space } from 'antd';

import Icon from 'elements/icon';

import style from './style.module.scss';

function FavoriteButton({
  enabled = false,
  enabledText = 'Удалить из избранного',
  disabledText = 'Добавить в избранное',
  onClick = () => {},
}) {
  const labelElement = (enabled ? enabledText : disabledText) || null;
  const iconName = enabled ? 'star' : 'star-outline';

  return (
    <Space className={style.container} onClick={onClick} size={4}>
      {labelElement}
      <Icon size={20} name={iconName} />
    </Space>
  );
}

export default FavoriteButton;
