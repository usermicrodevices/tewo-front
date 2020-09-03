import React from 'react';
import { EditOutlined } from '@ant-design/icons';
import { Button, Space } from 'antd';

import style from './style.module.scss';

const Footer = ({
  isEdditing, isHaveErrors, isUpdating, form, setIsEdduting, isEditable,
}) => {
  if (!isEditable) {
    return null;
  }
  if (isEdditing) {
    return (
      <Space>
        <Button disabled={isUpdating} onClick={() => { setIsEdduting(false); }}>Отмена</Button>
        <Button
          disabled={isHaveErrors}
          loading={isUpdating}
          onClick={() => form.submit()}
          type="primary"
        >
          Сохранить
        </Button>
      </Space>
    );
  }
  return (
    <div className={style.footer}>
      <Button type="text" icon={<EditOutlined />} onClick={() => { setIsEdduting(true); }}>Редактировать</Button>
    </div>
  );
};

export default Footer;
