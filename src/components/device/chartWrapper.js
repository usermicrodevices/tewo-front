/* eslint no-param-reassign: off */
import React from 'react';
import { inject, observer } from 'mobx-react';
import { Card } from 'antd';

import DatergangePicker from 'elements/filters/daterangepicker';
import CurvePicker from 'elements/curvePicker';

import style from './chartWrapper.module.scss';

const Clearance = ({ element: { details: { imputsManager } }, children, withCurvepicker }) => (
  <Card className={style.root}>
    <div className={style.selectors}>
      <DatergangePicker title="Период" value={imputsManager.dateRange} onChange={(v) => { imputsManager.dateRange = v; }} />
      { withCurvepicker && <CurvePicker imputsManager={imputsManager} /> }
    </div>
    <div className={style.chart}>
      { children }
    </div>
  </Card>
);

export default inject('element')(observer(Clearance));
