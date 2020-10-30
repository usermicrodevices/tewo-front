import React from 'react';
import { inject, observer } from 'mobx-react';
import { useLocation } from 'react-router-dom';
import classNames from 'classnames';

import { HumanizedPhone } from 'elements/phone';
import Version from 'elements/version';

import style from './style.module.scss';

const UnauthorizedPage = ({ auth, children }) => {
  const isShouldIHideContacts = useLocation().pathname === '/signup';
  return (
    <div className={style.login}>
      <div className={style.logo} />
      <div className={style.content}>{children}</div>
      <p className={classNames(style.contacts, { [style.hide]: isShouldIHideContacts })}>
        {auth.contacts.email}
        <br />
        <HumanizedPhone>{auth.contacts.phone}</HumanizedPhone>
      </p>
      <div className={style.version}><Version /></div>
    </div>
  );
};

export default inject('auth')(observer(UnauthorizedPage));
