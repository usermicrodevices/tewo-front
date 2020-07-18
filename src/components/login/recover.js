import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';
import Phone from 'elements/phone';

import { supportEmail, supportPhone } from 'config';
import style from './style.module.scss';

const Recover = () => (
  <div className={style.recover}>
    <div className={style.head}>
      <Link to="/signin"><ArrowLeftOutlined className={style.goback} /></Link>
      <h2>Не можете войти?</h2>
    </div>
    <p>
      Для восстановления пароля или по вопросам входа в систему обратитесь в службу технической поддержки по почте:&ensp;
      <a href={`mailto:${supportEmail}`}>{supportEmail}</a>
      <br />
      <br />
      или по телефону&ensp;
      <Phone>{supportPhone}</Phone>
    </p>
  </div>
);

export default Recover;
