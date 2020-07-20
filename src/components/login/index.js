import React from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import {
  Form, Input, Button,
} from 'antd';
import { UserOutlined, UnlockOutlined } from '@ant-design/icons';
import style from './style.module.scss';

@inject('auth')
@observer
class Login extends React.Component {
  onFinish = (values) => {
    const { auth } = this.props;
    auth.login(values);
  };

  render() {
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
            Войти
          </Button>
        </Form.Item>
        <Link to="/signup">Не можете войти?</Link>
      </Form>
    );
  }
}

export default Login;
