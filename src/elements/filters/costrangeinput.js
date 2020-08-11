import React from 'react';
import { InputNumber } from 'antd';

import style from './style.module.scss';

const CosrTangePicker = ({ title, value, onChange }) => {
  const { min, max } = value;

  return (
    <div className={style.space}>
      <p>{ `${title}:` }</p>
      <InputNumber placeholder="От" value={min} onChange={onChange} />
      <InputNumber placeholder="До" value={max} onChange={onChange} />
    </div>
  );
};

export default CosrTangePicker;
