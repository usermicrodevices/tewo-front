import React from 'react';
import { Card, Button, Space } from 'antd';
import { observer, inject } from 'mobx-react';

import ChangePasswordModal from './changePasswordModal';
import UserOverviewHeader from './header';
import UserPointsList from './pointsList';

export const UserOverviewActions = inject('element')(observer(({ element }) => (
  <Space>
    <Button onClick={element.showChangePassword}>Сменить пароль</Button>
  </Space>
)));

export const UserOverview = inject('element')(observer(({ element }) => (
  <Card>
    <UserOverviewHeader user={element} />
    <UserPointsList user={element} />
    <ChangePasswordModal user={element} />
  </Card>
)));
