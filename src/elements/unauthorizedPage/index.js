import React from 'react';
import { inject, observer } from 'mobx-react';
import { useLocation } from 'react-router-dom';
import classNames from 'classnames';

import Phone from 'elements/phone';
import Version from 'elements/version';

import style from './style.module.scss';

const UnauthorizedPage = ({ auth, children }) => {
  const isShouldIHideContacts = useLocation().pathname === '/signup';
  return (
    <div className={style.login}>
      <div className={style.logo} />
      <div className={style.content}>{children}</div>
      <p className={classNames(style.contacts, { [style.hide]: isShouldIHideContacts })}>
        <a href={`mailto:${auth.contacts.email}?subject=Обратная связь со страницы вход`}>{auth.contacts.email}</a>
        <Phone>{auth.contacts.phone}</Phone>
      </p>
      <div className={style.version}><Version /></div>
    </div>
  );
};

export default inject('auth')(observer(UnauthorizedPage));
