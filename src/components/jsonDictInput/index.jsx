import React, {
  useCallback, useState,
} from 'react';
import {
  Input, Button, Space, message,
} from 'antd';
import Icon from 'elements/icon';

function validateJsonDict(dict, newKey) {
  if (!newKey) {
    throw new Error('Ключ не может быть пустым!');
  }

  if (newKey in dict) {
    throw new Error('Такой ключ уже существует!');
  }
}

const JsonDictInput = ({
  onChange,
  value,
}) => {
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');

  const onChangeKey = useCallback((e) => {
    setNewKey(e.target.value);
  }, [setNewKey]);

  const onChangeValue = useCallback((e) => {
    setNewValue(e.target.value);
  }, [setNewValue]);

  const onChangeCurrentValue = useCallback((e) => {
    const key = e.target.name;
    const keyValue = e.target.value;

    onChange({
      ...value,
      [key]: keyValue,
    });
  }, [onChange, value]);

  const onPressAdd = useCallback(() => {
    try {
      validateJsonDict(value, newKey, newValue);

      onChange({
        ...value,
        [newKey]: newValue,
      });

      setNewKey('');
      setNewValue('');
    } catch (e) {
      message.error(e.message);
    }
  }, [setNewKey, setNewValue, onChange, value, newKey, newValue]);

  const onPressDelete = useCallback((deletedKey) => {
    const newJsonValue = Object.keys(value).filter((key) => key !== deletedKey).reduce((acc, e) => {
      acc[e] = value[e];
      return acc;
    }, {});

    onChange(newJsonValue);
  }, [onChange, value]);

  return (
    <Space direction="vertical" size={16}>
      {Object.keys(value).sort().map((key) => (
        <Space size={8}>
          <Input value={key} disabled />
          <Input placeholder="Значение" value={value[key]} name={key} onChange={onChangeCurrentValue} />
          <Button onClick={() => onPressDelete(key)}><Icon name="trash-2-outline" /></Button>
        </Space>
      ))}
      <Space size={8}>
        <Input autoFocus placeholder="Ключ" value={newKey} onChange={onChangeKey} onPressEnter={onPressAdd} />
        <Input placeholder="Значение" value={newValue} onChange={onChangeValue} onPressEnter={onPressAdd} />
        <Button onClick={onPressAdd}><Icon name="plus-outline" /></Button>
      </Space>
    </Space>
  );
};

export default JsonDictInput;
