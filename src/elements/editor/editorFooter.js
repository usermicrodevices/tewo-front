import React from 'react';
import { EditOutlined } from '@ant-design/icons';
import { Button, Space } from 'antd';
import classNames from 'classnames';

import style from './style.module.scss';

const Footer = ({
  isEdditing,
  isHaveErrors,
  isUpdating,
  form,
  setIsEdditing,
  isEditable,
  isModal,
}) => {
  if (!isEditable) {
    return null;
  }
  if (isEdditing) {
    return (
      <div className={style[`${isModal ? 'modal-' : ''}bottom`]}>
        <Space>
          <Button disabled={isUpdating} onClick={() => { setIsEdditing(false); }}>Отмена</Button>
          <Button
            disabled={isHaveErrors}
            loading={isUpdating}
            onClick={() => { form.submit(); }}
            type="primary"
          >
            Сохранить
          </Button>
        </Space>
      </div>
    );
  }
  return (
    <div className={classNames(style['start-edditing-button'], style[`${isModal ? 'modal-' : ''}bottom`])}>
      <Button type="text" icon={<EditOutlined />} onClick={() => { setIsEdditing(true); }}>Редактировать</Button>
    </div>
  );
};

export default Footer;
