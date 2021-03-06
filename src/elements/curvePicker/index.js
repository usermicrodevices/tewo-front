/* eslint no-param-reassign: off */
import React from 'react';
import { observer } from 'mobx-react';
import { Switch } from 'antd';

import { SALES_DATA_TYPES } from 'models/detailsProps';

import style from './style.module.scss';

const CurvePicker = observer(({ imputsManager }) => (
  <Switch
    checkedChildren="Продажи"
    unCheckedChildren="Наливы"
    className={style.allTimeActive}
    defaultChecked={imputsManager.visibleCurves[0] === SALES_DATA_TYPES[0].value}
    onChange={(d) => { imputsManager.visibleCurves = SALES_DATA_TYPES.slice(d ? 0 : 2, d ? 2 : 4).map(({ value }) => value); }}
  />
));

export default CurvePicker;
