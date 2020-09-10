import React from 'react';
import { Card } from 'antd';
import { withSize } from 'react-sizeme';

import plural from 'utils/plural';
import Loader from 'elements/loader';
import Format from 'elements/format';

import style from './top.module.scss';

const COLORS = [
  '#94FBD0',
  '#3791F3',
  '#F4B144',
  '#CCCCCC',
  '#EBCFC0',
  '#B5EE93',
];

const Top = ({ size: { width } }) => {
  const isLoaded = false;
  const list = [1, 2, 3, 4, 5].map(() => Math.round(Math.random() * Math.random() * 10000));
  const columWidth = (width - 450) / Math.ceil(list.length / 3);
  const labelAllowedWidth = (columWidth - 200) * 1.5;
  return (
    <Card className={style.root}>
      <div className={style.title}>Топ продаж</div>
      <div className={style.chart}>
        {
          isLoaded
            ? null
            : <Loader size="large" />
        }
      </div>
      <div className={style.list}>
        {
          list.map((t, index) => (
            <div className={style.item} key={t}>
              <div className={style.label}>
                <div className={style.mark} style={{ backgroundColor: COLORS[index] }} />
                <Format width={labelAllowedWidth}>Тёплое мокачино с пряными травами и водными настоями на пряных травах</Format>
              </div>
              <div className={style.value}>
                <div className={style.number}><Format>{t}</Format></div>
                <div className={style.sublabel}>{plural(t, ['налив', 'наливов', 'налива'])}</div>
              </div>
            </div>
          ))
        }
      </div>
    </Card>
  );
};

export default withSize()(Top);
