import React from 'react';
import { inject, observer } from 'mobx-react';

import { Pie, PIE_COLORS } from 'elements/chart/pie';
import Loader from 'elements/loader';
import Format from 'elements/format';

import classes from './index.module.scss';

const DiagramTechState = inject('storage')(observer(({
  storage: { chart, isLoaded },
}) => {
  if (!isLoaded) {
    return <div className={classes.root}><Loader /></div>;
  }
  return (
    <div className={classes.root}>
      <Pie
        series={chart.map(({ count }) => count)}
        width={200}
        labels={chart.map(({ label }) => label)}
      />
      {chart.slice(0, 4).map(({ count, label, id }, index) => (
        <div className={classes.item} key={id}>
          <div className={classes.dot} style={{ backgroundColor: PIE_COLORS[index] }} />
          <div className={classes.label}><Format>{label}</Format></div>
          <div className={classes.value}><Format>{count}</Format></div>
        </div>
      ))}
    </div>
  );
}));

export default DiagramTechState;
