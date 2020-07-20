import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import 'typeface-inter';
import Auth from 'models/auth';

import RootRouter from './rootRouter';

const auth = new Auth();

ReactDOM.render(
  <Provider auth={auth}><RootRouter /></Provider>,
  document.getElementById('root'),
);
