import React, { useState } from 'react';
import {
  Button, InputNumber, Input, message,
} from 'antd';
import {
  EditOutlined, SendOutlined, LoadingOutlined, StopOutlined,
} from '@ant-design/icons';
import classNames from 'classnames';

import Format from 'elements/format';

import classes from './priceCell.module.scss';

const PriceCell = (value, { sendValue, codeExt }) => {
  const [isWarn, setWarn] = useState(false);
  const [isEdditing, setEdditing] = useState(false);
  const [isSending, setSending] = useState(false);
  const [isSuccess, setSuccess] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);
  const [currentCodeExt, setCurrentCodeExt] = useState(codeExt);

  const commit = () => {
    if (currentValue !== value || currentCodeExt !== codeExt) {
      sendValue(currentValue, currentCodeExt)
        .then(() => {
          message.success('Цена успешно обновлена');
          setSuccess(true);
          setTimeout(() => { setSuccess(false); }, 1000);
        })
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
      <div className={classNames(classes.root, { [classes.warn]: isWarn, [classes.success]: isSuccess })}>
        <div className={classes.inputs}>
          <InputNumber className={classes.input} min={0} defaultValue={currentValue} onChange={setCurrentValue} />
          <Input className={classes.input} placeholder="code ext" defaultValue={currentCodeExt} onChange={(e) => setCurrentCodeExt(e.target.value)} />
        </div>
        <div className={classes.actions}>
          <Button
            icon={<SendOutlined style={{ transform: 'scale(1.37)' }} />}
            type="text"
            onClick={commit}
          />
          <Button
            icon={<StopOutlined />}
            type="text"
            onClick={() => { setEdditing(false); }}
          />
        </div>
      </div>
    );
  }
  return (
    <div className={classNames(classes.root, { [classes.warn]: isWarn, [classes.success]: isSuccess })}>
      <span>
        <Format isCost>{value}</Format>
        {' '}
        (
        {codeExt || '–'}
        )
      </span>
      {
        isSending
          ? <LoadingOutlined />
          : <Button icon={<EditOutlined style={{ transform: 'scale(1.37)' }} />} type="text" onClick={() => { setEdditing(true); }} />
      }
    </div>
  );
};

export default PriceCell;
