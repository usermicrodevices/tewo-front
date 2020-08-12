import React from 'react';
import { InputNumber } from 'antd';

import style from './style.module.scss';

const CosrTangePicker = ({ title, value, onChange }) => {
  const [min, max] = Array.isArray(value) ? value : [null, null];
  return (
    <div className={style.space}>
      <p>{ `${title}:` }</p>
      <InputNumber placeholder="0" value={min} onChange={(val) => onChange([val, max])} />
      <InputNumber placeholder="∞" value={max} onChange={(val) => onChange([min, val])} />
    </div>
  );
};

export default CosrTangePicker;
