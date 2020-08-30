import React from 'react';
import { Input, Form } from 'antd';
import { CompactPicker } from 'react-color';

const ColorPicker = ({ getFieldValue, setFieldsValue, name }) => {
  const color = getFieldValue(name) || '#FFFFFF';
  return (
    <>
      <Form.Item noStyle name={name}><Input style={{ display: 'none' }} /></Form.Item>
      <CompactPicker
        color={color}
        onChangeComplete={(value) => value && setFieldsValue({ [name]: value.hex })}
      />
    </>
  );
};

export default ColorPicker;
