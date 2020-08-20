import React from 'react';
import { Input } from 'antd';

const CellEditor = ({ onChange, value, editor: { type } }) => {
  switch (type) {
    case 'text': {
      return <Input value={value} onChange={onChange} />;
    }
    default: {
      console.error(`unknown edotir type ${type}`);
      return value;
    }
  }
};

export default CellEditor;
