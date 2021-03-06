import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import moment from 'moment';
import 'moment/locale/ru';
import 'typeface-inter';
import { ConfigProvider } from 'antd';
import 'mobx-react-lite/batchingForReactDom';
import { YMaps } from 'react-yandex-maps';

import ru from 'antd/es/locale/ru_RU';

import Auth from 'models/auth';
import RootRouter from './rootRouter';

import 'themes/style.scss';

moment.locale('ru');

const auth = new Auth();

ReactDOM.render(
  <ConfigProvider locale={ru}>
    <Provider auth={auth}>
      <YMaps>
        <RootRouter />
      </YMaps>
    </Provider>
  </ConfigProvider>,
  document.getElementById('root'),
);
