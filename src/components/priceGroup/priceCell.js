import React, { useState } from 'react';
import { Button, InputNumber, message } from 'antd';
import { EditOutlined, SendOutlined, LoadingOutlined } from '@ant-design/icons';
import classNames from 'classnames';

import Format from 'elements/format';

import classes from './priceCell.module.scss';

const PriceCell = (value, { sendValue }) => {
  const [isWarn, setWarn] = useState(false);
  const [isEdditing, setEdditing] = useState(false);
  const [isSending, setSending] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);

  const commit = () => {
    if (currentValue !== value) {
      sendValue(currentValue)
        .catch(() => {
          message.error('Не удалось обновить цену');
          setWarn(true);
          setTimeout(() => { setWarn(false); }, 1000);
        })
        .finally(() => {
          setSending(false);
        });
      setSending(true);
    }
    setEdditing(false);
  };
  if (isEdditing) {
    return (
      <div className={classNames(classes.root, { [classes.warn]: isWarn })}>
        <InputNumber defaultValue={currentValue} onChange={setCurrentValue} />
        <Button
          icon={<SendOutlined style={{ transform: 'scale(1.37)' }} />}
          type="text"
          onClick={commit}
        />
      </div>
    );
  }
  return (
    <div className={classNames(classes.root, { [classes.warn]: isWarn })}>
      <Format>{value}</Format>
      {
        isSending
          ? <LoadingOutlined />
          : <Button icon={<EditOutlined style={{ transform: 'scale(1.37)' }} />} type="text" onClick={() => { setEdditing(true); }} />
      }
    </div>
  );
};

export default PriceCell;
