import React from 'react';
import {
  Form, Input, Button,
} from 'antd';
import { UserOutlined, UnlockOutlined } from '@ant-design/icons';
import { login } from 'models/auth';
import style from './style.module.scss';

class Login extends React.Component {
  onFinish = (values) => {
    login(values);
  };

  render() {
    return (
      <div className={style.login}>
        <h1>Telemetry.Work</h1>
        <Form
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
              Войти
            </Button>
          </Form.Item>
          <a>Не можете войти?</a>
        </Form>
        <p>
          support@telemetry.work
          <br />
          +7 000 999 11 22
        </p>
        <p>version 0.0.0</p>
      </div>
    );
  }
}

export default Login;
