import React, { useState } from 'react';
import { inject, observer } from 'mobx-react';
import { Switch, Tooltip } from 'antd';

import Format from 'elements/format';
import Loader from 'elements/loader';

import style from './index.module.scss';

const sweetLabelsMax = (max) => {
  const variants = [4, 6, 10, 20, 50, 100, 200, 500, 1000, 1500, 2500, 4000, 5000, 8000, 10000,
    12000, 15000, 18000, 20000, 22000, 25000, 28000, 30000, 34000, 40000, 50000, 60000, 80000, 100000];
  let result = 0;
  while (result < variants.length && variants[result] < max) {
    result += 1;
  }
  return Math.max(variants[result], max);
};

const BeveragesRateDiagram = inject(({ session, storage }) => ({ session, storage }))(observer(({ session, storage }) => {
  const [order, changeOrder] = useState(1);
  if (typeof storage.data === 'undefined') {
    return <div className={style.wrap}><Loader /></div>;
  }
  const top = Object.entries(storage.top)
    .sort(([id1, a], [id2, b]) => Math.sign(b - a) * order || Math.sign(id1 - id2))
    .slice(0, 10);
  const salePointsSet = new Set(top.map(([id]) => parseInt(id, 10)));
  const namesMap = {};
  if (session.points.isLoaded) {
    for (const { id, name } of session.points.getSubset(salePointsSet)) {
      namesMap[id] = name;
    }
  }
  let maxValue = 0;
  for (const [, value] of top) {
    maxValue = Math.max(maxValue, value);
  }
  maxValue = sweetLabelsMax(maxValue);
  return (
    <div className={style.wrap}>
      <div className={style.chart}>
        { top.map(([id, value]) => (
          <React.Fragment key={id}>
            <div className={style.name}><Format>{namesMap[id]}</Format></div>
            <div className={style.value}><Tooltip title={value}><div style={{ width: `${Math.round(value / maxValue * 100)}%` }} /></Tooltip></div>
          </React.Fragment>
        ))}
        <div />
        <div className={style.labels}>
          { [0, 1, 2].map((v) => <div>{maxValue / 2 * v}</div>)}
        </div>
      </div>
      <Switch
        checkedChildren="По убыванию"
        unCheckedChildren="По возрастанию"
        className={style.switch}
        defaultChecked={order > 0}
        onChange={() => { changeOrder(order * -1); }}
      />
    </div>
  );
}));

export default BeveragesRateDiagram;
