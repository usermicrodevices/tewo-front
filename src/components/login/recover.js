import React from 'react';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { ArrowLeftOutlined } from '@ant-design/icons';
import Phone from 'elements/phone';

import style from './style.module.scss';

const Recover = ({ auth }) => (
  <div className={style.recover}>
    <div className={style.head}>
      <Link to="/signin"><ArrowLeftOutlined className={style.goback} /></Link>
      <h2>Не можете войти?</h2>
    </div>
    <p>
      Для восстановления пароля или по вопросам входа в систему обратитесь в службу технической поддержки по почте:&ensp;
      <a href={`mailto:${auth.contacts.email}`}>{auth.contacts.email}</a>
      <br />
      <br />
      или по телефону&ensp;
      <Phone>{auth.contacts.phone}</Phone>
    </p>
  </div>
);

export default inject('auth')(observer(Recover));
