import React from 'react';
import { Card, Button, Space } from 'antd';
import { observer, inject } from 'mobx-react';

import ChangePasswordModal from 'components/user/changePasswordModal';

import UserOverviewHeader from './header';
import UserPointsList from './pointsList';

import styles from './styles.module.scss';

export const UserOverviewActions = inject('element')(observer(({ element }) => (
  <>
    <Space>
      <Button onClick={element.showChangePassword}>Сменить пароль</Button>
    </Space>
    <ChangePasswordModal user={element} />
  </>
)));

export const UserOverview = inject('element')(observer(({ element }) => (
  <Card>
    <UserOverviewHeader user={element} />
    <UserPointsList user={element} className={styles.pointsList} />
  </Card>
)));
