import React from 'react';
import { inject, observer } from 'mobx-react';

import Format from 'elements/format';
import Loader from 'elements/loader';
import Typography from 'elements/typography';
import plural from 'utils/plural';

import Chart from './chart';

import style from './index.module.scss';

const Statistic = inject(({ session, storage }) => ({ session, storage }))(observer(({ session, storage }) => (
  <div className={style.layout}>
    <div className={style.beverages}>
      <Typography.Value size="xxxl"><Format>{storage.value}</Format></Typography.Value>
      <Typography.Caption>
        {plural(storage.value, ['Налив', 'Наливов', 'Налива'])}
        <br />
        за 30 минут
      </Typography.Caption>
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
        if (session.points.isLoaded) {
          for (const { id, name } of session.points.getSubset(salePointsSet)) {
            namesMap[id] = name;
          }
        }
        return (
          <>
            { items.map(([id, { beverages }]) => (
              <div key={id} className={style.note}>
                <Typography.Text><Format width={250}>{ namesMap[id] }</Format></Typography.Text>
                <Typography.Text className={style.beverages}><Format>{ beverages }</Format></Typography.Text>
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
