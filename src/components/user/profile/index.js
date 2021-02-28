import React from 'react';
import { inject, observer } from 'mobx-react';
import {
  Card, Button, Space, Popconfirm,
} from 'antd';

import Editor from 'elements/editor';
import Typography from 'elements/typography';

import ChangePasswordModal from 'components/user/changePasswordModal';

import AvatarUpload from './avatarUpload';
import Greating from './greating';

import styles from './styles.module.scss';

function Profile({ auth }) {
  return (
    <Card>
      <header className={styles.header}>
        <AvatarUpload user={auth.user} className={styles.avatar} />
        <section>
          <Typography.Text><Greating hours={(new Date()).getHours()} /></Typography.Text>
          <Typography.Title level={2}>{auth.user.name}</Typography.Title>

          <Space className={styles.actions}>
            <Button onClick={auth.user.showChangePassword}>Сменить пароль</Button>
            <Popconfirm
              overlayStyle={{ width: 300 }}
              onConfirm={auth.clear}
              title="Вы уверены, что хотите сбросить сессию? Настройки пользователя, дашборда и таблиц будут сброшены, без возможности восстановления."
              okText="Да"
              cancelText="Нет"
            >
              <Button danger>Сбрость сессию</Button>
            </Popconfirm>
          </Space>
        </section>
      </header>

      <Editor data={auth.user} />

      <ChangePasswordModal user={auth.user} />
    </Card>
  );
}

export default inject('auth')(observer(Profile));
