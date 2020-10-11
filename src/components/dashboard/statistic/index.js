import React from 'react';
import { inject, observer } from 'mobx-react';

import Format from 'elements/format';
import Loader from 'elements/loader';
import plural from 'utils/plural';

import Chart from './chart';

import style from './index.module.scss';

const Statistic = inject(({ session, storage }) => ({ session, storage }))(observer(({ session, storage }) => (
  <div className={style.layout}>
    <div className={style.beverages}>
      <div className={style.value}><Format>{storage.value}</Format></div>
      <div className={style.explains}>
        {plural(storage.value, ['Налив', 'Наливов', 'Налива'])}
        <br />
        за 30 минут
      </div>
    </div>
    <div className={style.top}>
      {(() => {
        const namesMap = {};
        if (typeof storage.top === 'undefined') {
          return <Loader />;
        }
        const items = Object.entries(storage.top)
          .sort(([_, b1], [__, b2]) => Math.sign(b2.beverages - b1.beverages))
          .slice(0, 6);
        const salePointsSet = new Set(items.map(([id]) => parseInt(id, 10)));
        for (const { id, name } of session.points.getSubset(salePointsSet)) {
          namesMap[id] = name;
        }
        return (
          <>
            { items.map(([id, { beverages }]) => (
              <div key={id} className={style.note}>
                <div><Format width={250}>{ namesMap[id] }</Format></div>
                <div className={style.beverages}><Format>{ beverages }</Format></div>
              </div>
            ))}
          </>
        );
      })()}
    </div>
    <Chart />
  </div>
)));

export default Statistic;
