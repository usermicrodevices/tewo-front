/* eslint no-param-reassign: off */
import React from 'react';
import { inject, observer } from 'mobx-react';
import {
  Dropdown, Button, Checkbox, Menu,
} from 'antd';

import Icon from 'elements/icon';
import { SALES_DATA_TYPES } from 'models/detailsProps';

import style from './sales.module.scss';

const CurveMenu = inject('element')(observer(({ element: { details: { imputsManager } } }) => {
  const options = SALES_DATA_TYPES.map((data) => ({
    ...data,
    disabled: imputsManager.visibleCurves.length === 1 && imputsManager.visibleCurves[0] === data.value,
  }));
  return (
    <Menu>
      <div className={style.curvemenu}>
        <Checkbox.Group options={options} defaultValue={imputsManager.visibleCurves} onChange={(d) => { imputsManager.visibleCurves = d; }} />
      </div>
    </Menu>
  );
}));

const CurvePicker = () => (
  <Dropdown overlay={<CurveMenu />} placement="bottomRight">
    <Button type="text">
      Показатели
      <Icon color="text" name="arrow-ios-downward-outline" />
    </Button>
  </Dropdown>
);

export default CurvePicker;
