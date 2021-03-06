import React from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import {
  Form, Input, Button, message,
} from 'antd';
import { UserOutlined, UnlockOutlined, LoadingOutlined } from '@ant-design/icons';

import { signup } from 'routes';

import style from './style.module.scss';

@inject('auth')
@observer
class Login extends React.Component {
  state = { isAuthChecking: false };

  onFinish = (values) => {
    const { auth } = this.props;
    const { isAuthChecking } = this.state;
    if (isAuthChecking) {
      return;
    }
    this.setState({ isAuthChecking: true });
    auth.login(values).catch((err) => {
      this.setState({ isAuthChecking: false });
      const reason = err.response ? err.response.data : '';
      if (JSON.stringify(reason) === JSON.stringify({ non_field_errors: ['Unable to log in with provided credentials.'] })) {
        message.error('Неизвестное сочетание логина и пароля');
      } else {
        message.error('Произошла ошибка при обработке авторизационных данных');
      }
    });
  };

  render() {
    const { isAuthChecking } = this.state;
    return (
      <Form
        className={style.form}
        name="basic"
        initialValues={{ remember: true }}
        onFinish={this.onFinish}
      >
        <h2>Войдите в свой аккаунт</h2>
        <Form.Item
          noStyle
          name="username"
          rules={[{ required: true, message: 'Пожалуйста введите имя пользователя' }]}
        >
          <Input placeholder="Логин" prefix={<UserOutlined className="site-form-item-icon" />} />
        </Form.Item>

        <Form.Item
          noStyle
          name="password"
          rules={[{ required: true, message: 'Пожалуйста введите пароль' }]}
        >
          <Input.Password placeholder="Пароль" prefix={<UnlockOutlined className="site-form-item-icon" />} />
        </Form.Item>

        <Form.Item noStyle>
          <Button type="primary" htmlType="submit" block>
            { isAuthChecking && <LoadingOutlined /> }
            Войти
          </Button>
        </Form.Item>
        <Link to={signup.path}>Не можете войти?</Link>
      </Form>
    );
  }
}

export default Login;
