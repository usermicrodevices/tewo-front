import React, { useState } from 'react';
import { observer } from 'mobx-react';
import {
  Upload, message, Button, Space,
} from 'antd';
import { LoadingOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import cx from 'classnames';

import styles from './styles.module.scss';

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('Допустимо грузить только изображения в формате jpeg или png!');
  }
  const isLt1M = file.size / 1024 / 1024 < 1;
  if (!isLt1M) {
    message.error('Изображение должно весить меньше 1MB!');
  }
  return isJpgOrPng && isLt1M;
}

export default observer(({ user, className }) => {
  const [loading, setLoading] = useState(false);
  const { avatar, changeAvatar } = user;

  const handleChange = (info) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj, (image) => {
        setLoading(false);
        changeAvatar(image);
      });
    }
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Загрузить</div>
    </div>
  );

  const dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess(file);
    }, 0);
  };

  const remove = () => {
    changeAvatar('');
  };

  return (
    <section className={cx([styles.container, className])}>
      <Upload
        name="avatar"
        listType="picture-card"
        showUploadList={false}
        customRequest={dummyRequest}
        beforeUpload={beforeUpload}
        onChange={handleChange}
      >
        {avatar ? <img src={avatar} alt="avatar" /> : uploadButton}
      </Upload>
      {avatar
        ? (
          <Space>
            <Button onClick={remove} icon={<DeleteOutlined />}>Удалить</Button>
          </Space>
        ) : null }
    </section>
  );
});
