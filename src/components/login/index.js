import React from 'react';
import {
  Form, Input, Button, Checkbox,
} from 'antd';
import { login } from 'models/auth';

const span = 8;
const labelCol = { span };
const layoutWrapperCol = { span };
const buttonWrapperCol = { offset: span, span };

class Login extends React.Component {
  onFinish = (values) => {
    login(values);
  };

  render() {
    return (
      <Form
        wrapperCol={layoutWrapperCol}
        labelCol={labelCol}
        name="basic"
        initialValues={{ remember: true }}
        onFinish={this.onFinish}
      >
        <Form.Item
          label="Пользователь"
          name="username"
          rules={[{ required: true, message: 'Пожалуйста введите имя пользователя' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Пароль"
          name="password"
          rules={[{ required: true, message: 'Пожалуйста введите пароль' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item wrapperCol={buttonWrapperCol} name="remember" valuePropName="checked">
          <Checkbox>Запомнить меня</Checkbox>
        </Form.Item>

        <Form.Item wrapperCol={buttonWrapperCol}>
          <Button type="primary" htmlType="submit">
            Вход
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

export default Login;
