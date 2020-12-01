import React from 'react';
import { Modal, Input, Form } from 'antd';
import { observer } from 'mobx-react';

const ChangePasswordModal = observer(({ user }) => {
  const [form] = Form.useForm();
  const { changePasswordShown, hideChangePassword } = user;

  const onOk = () => {
    form.submit();
  };

  const onFinish = (values) => {
    user.changePassword(values.password);
  };

  return (
    <Modal visible={changePasswordShown} onCancel={hideChangePassword} title="Изменение пароля" onOk={onOk} okText="Изменить">
      <Form form={form} name="changePasswordForm" onFinish={onFinish}>
        <Form.Item
          name="password"
          label="Новый пароль"
          hasFeedback
          rules={[{
            required: true,
            message: 'Введите новый пароль!',
          }, {
            min: 8,
            message: 'Минимальная длина пароля – 8 символов',
          }]}
        >
          <Input.Password
            name="password"

          />
        </Form.Item>
        <Form.Item
          name="repeat"
          label="Повторите пароль"
          dependencies={['password']}
          hasFeedback
          rules={[{
            required: true,
            message: 'Повторите пароль!',
          }, ({ getFieldValue }) => ({
            validator(rule, value) {
              if (value && getFieldValue('password') !== value) {
                // eslint-disable-next-line prefer-promise-reject-errors
                return Promise.reject('Пароли не совпадают!');
              }
              return Promise.resolve();
            },
          })]}
        >
          <Input.Password
            name="repeat"

          />
        </Form.Item>
      </Form>
    </Modal>
  );
});

export default ChangePasswordModal;
