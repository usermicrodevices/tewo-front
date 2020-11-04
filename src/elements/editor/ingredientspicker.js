import React from 'react';
import {
  Form, InputNumber, Input,
} from 'antd';

import style from './style.module.scss';

const LocationPicker = ({ getFieldValue, setFieldsValue, name }) => {
  const val = getFieldValue(name) || [0, 0, 0];
  // Так и не понял почему, но пока не добавишь Form.Item значение не попадает в submit
  return (
    <div className={style.ingredients}>
      <Form.Item noStyle name={name}><Input /></Form.Item>
      <table>
        <tbody>
          {
            ['Наливы молока', 'Наливы воды', 'Наливы кофе'].map((ingredient, id) => (
              <tr key={ingredient}>
                <td>{ingredient}</td>
                <td><InputNumber onChange={(num) => { val[id] = num; setFieldsValue({ [name]: val }); }} /></td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  );
};

export default LocationPicker;
