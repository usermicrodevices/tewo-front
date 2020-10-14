import React from 'react';
import { observer } from 'mobx-react';

import arrowSrc from './assets/arrow.png';
import backgroundSrc from './assets/background.png';

import classnames from './index.module.scss';

const BACKGROUND_SIZE_RATIO = 1 / 2;

const Speedometr = ({ value, max }) => {
  const progress = value / max;
  const backgroundStyle = { paddingTop: `${BACKGROUND_SIZE_RATIO * 100}%` };
  const arrowImageStyle = { transform: `rotate(${-90 + 180 * progress}deg)` };

  return (
    <div className={classnames.root}>
      <div style={backgroundStyle} className={classnames.background}>
        <img
          className={classnames.image}
          src={backgroundSrc}
          alt="Фон для спидометра"
        />
      </div>

      <div className={classnames.arrow}>
        <img
          className={classnames.image}
          style={arrowImageStyle}
          src={arrowSrc}
          alt="Стрелка спидометра"
        />
      </div>
    </div>
  );
};

export default observer(Speedometr);
