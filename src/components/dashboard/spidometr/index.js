import React, { useEffect } from 'react';
import { inject, observer } from 'mobx-react';

import Format from 'elements/format';
import Typography from 'elements/typography';
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
        <Typography.Value size="xxxl">
          <Format width={150}>{value}</Format>
        </Typography.Value>
        <Typography.Text>{speedLabelText}</Typography.Text>
      </div>
      <SeedometrChart value={value} max={maxSpeed} />
    </div>
  );
};

export default inject('storage')(observer(Speedometr));
