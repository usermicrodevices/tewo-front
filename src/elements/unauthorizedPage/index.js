import React from 'react';
import { useLocation } from 'react-router-dom';
import classNames from 'classnames';

import { HumanizedPhone } from 'elements/phone';
import Version from 'elements/version';

import { supportEmail, supportPhone, appName } from 'config';
import style from './style.module.scss';

const UnauthorizedPage = ({ children }) => {
  const isShouldIHideContacts = useLocation().pathname === '/signup';
  return (
    <div className={style.login}>
      <h1>{appName}</h1>
      <div className={style.content}>{children}</div>
      <p className={classNames(style.contacts, { [style.hide]: isShouldIHideContacts })}>
        {supportEmail}
        <br />
        <HumanizedPhone>{supportPhone}</HumanizedPhone>
      </p>
      <Version />
    </div>
  );
};

export default UnauthorizedPage;
