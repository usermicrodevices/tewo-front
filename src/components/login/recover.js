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
      Для восстановления пароля или по
      <br />
      вопросам входа в систему обратитесь
      <br />
      в службу технической поддержки:
      <br />
      <br />
      по почте:&ensp;
      <a href={`mailto:${auth.contacts.email}?subject=Проблемы со входом на сервис телеметрии`}>{auth.contacts.email}</a>
      <br />
      по телефону:&ensp;
      <Phone>{auth.contacts.phone}</Phone>
    </p>
  </div>
);

export default inject('auth')(observer(Recover));
