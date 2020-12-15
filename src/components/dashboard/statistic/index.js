import React from 'react';
import { inject, observer } from 'mobx-react';

import Format from 'elements/format';
import Typography from 'elements/typography';
import plural from 'utils/plural';
import { salePoints as salePointsRout } from 'routes';
import { tableItemLink } from 'elements/table/trickyCells';

import Chart from './chart';

import style from './index.module.scss';

const Statistic = inject(({ session, storage }) => ({ session, storage }))(observer(({ session, storage }) => (
  <div className={style.layout}>
    <div className={style.beverages}>
      {
        typeof storage.value !== 'undefined' && (
          <>
            <Typography.Value size="xxxl"><Format>{storage.value}</Format></Typography.Value>
            <Typography.Caption className={style.caption} type="secondary">
              {plural(storage.value, ['налив', 'наливов', 'налива'])}
              <br />
              за 30 минут
            </Typography.Caption>
          </>
        )
      }
    </div>
    <div className={style.top}>
      {(() => {
        const pointsMap = {};
        if (typeof storage.top === 'undefined') {
          return null;
        }
        const items = Object.entries(storage.top)
          .sort(([, b1], [, b2]) => Math.sign(b2.beverages - b1.beverages))
          .slice(0, 4);
        const salePointsSet = new Set(items.map(([id]) => parseInt(id, 10)));
        if (session.points.isLoaded) {
          for (const point of session.points.getSubset(salePointsSet)) {
            pointsMap[point.id] = point;
          }
        }
        return (
          <>
            { items.map(([id, { beverages, deviceState }]) => (
              <React.Fragment key={id}>
                <div className={style.note}>
                  <Typography.Text>{ tableItemLink(pointsMap[id]?.name, `${salePointsRout.path}/${id}`, 450) }</Typography.Text>
                  <Typography.Text className={style.beverages}><Format>{ beverages }</Format></Typography.Text>
                </div>
                <div className={style.rate}>
                  <div style={{ backgroundColor: '#FF3B30' }}><Format>{ deviceState.err }</Format></div>
                  <div style={{ backgroundColor: '#F7C955' }}><Format>{ deviceState.warn }</Format></div>
                  <div style={{ backgroundColor: '#4CD964' }}><Format>{ deviceState.ok }</Format></div>
                  <div style={{ backgroundColor: '#666666' }}><Format>{ deviceState.grey }</Format></div>
                </div>
              </React.Fragment>
            ))}
          </>
        );
      })()}
    </div>
    <Chart />
  </div>
)));

export default Statistic;
