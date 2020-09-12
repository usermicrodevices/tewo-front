/* eslint no-param-reassign: "off" */
import React from 'react';
import { inject, observer } from 'mobx-react';
import {
  Dropdown, Button, Checkbox, Menu,
} from 'antd';

import Icon from 'elements/icon';
import { CURVE_TYPES } from 'models/salePoints/details';

import style from './sales.module.scss';

const CurveMenu = inject('element')(observer(({ element: { details } }) => {
  const options = CURVE_TYPES.map((data) => ({
    ...data,
    disabled: details.visibleCurves.length === 1 && details.visibleCurves[0] === data.value,
  }));
  return (
    <Menu>
      <div className={style.curvemenu}>
        <Checkbox.Group options={options} defaultValue={details.visibleCurves} onChange={(d) => { details.visibleCurves = d; }} />
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
