import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import 'typeface-inter';
import Auth from 'models/auth';
import 'mobx-react-lite/batchingForReactDom';
import moment from 'moment';
import 'moment/locale/ru';

import RootRouter from './rootRouter';

import 'themes/style.scss';

moment.locale('ru');

const auth = new Auth();

ReactDOM.render(
  <Provider auth={auth}><RootRouter /></Provider>,
  document.getElementById('root'),
);
