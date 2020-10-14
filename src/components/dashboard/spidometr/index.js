import React, { useEffect } from 'react';
import { inject, observer } from 'mobx-react';

import Format from 'elements/format';
import SeedometrChart from 'elements/chart/speedometr';

import plural from 'utils/plural';

import classnames from './index.module.scss';

const UPDATE_INTERVAL = 60 * 1000; // once per minute

const Speedometr = ({ storage: { value, maxSpeed, updateValue } }) => {
  useEffect(() => {
    const intervalId = setInterval(updateValue, UPDATE_INTERVAL);
    return () => clearInterval(intervalId);
  }, []);

  const speedLabelText = `${plural(value, ['налив', 'наливов', 'налива'])} / час`;

  return (
    <div className={classnames.root}>
      <div className={classnames.header}>
        <div className={classnames.value}>
          <Format width={150}>{value}</Format>
        </div>
        <div className={classnames.label}>
          <span>{speedLabelText}</span>
        </div>
      </div>
      <SeedometrChart value={value} max={maxSpeed} />
    </div>
  );
};

export default inject('storage')(observer(Speedometr));
