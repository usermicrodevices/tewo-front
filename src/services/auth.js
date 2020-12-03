import { message } from 'antd';
import { post, get } from 'utils/request';
import checkData, { checkEmail } from 'utils/dataCheck';
import apiCheckConsole from 'utils/console';

import { transformUser } from 'services/users';

import Profile from 'models/profile';

function login(data) {
  return new Promise((resolve, reject) => {
    post('login', data).then((response) => {
      if (typeof response.token !== 'string') {
        reject(new Error(response));
      }
      resolve(response.token);
    }).catch(reject);
  });
}

function contacts() {
  const path = '/tech/contacts/?limit=1';
  const defaultContacts = { phone: '+78007003942', email: 'support@service-pb.ru' };
  return new Promise((resolve) => {
    get(path).then(({ results: data }) => {
      if (!Array.isArray(data)) {
        apiCheckConsole.error(`${path} ожидается массив, получен ${typeof data}`);
        return defaultContacts;
      }

      const item = data.sort(({ id: idA }, { id: idB }) => Math.sign(idB - idA))[0];
      if (!checkData(item, {
        id: 'number',
        info: 'string',
        privacy: 'string',
      })) {
        apiCheckConsole.error(`${path} получил некорректные данные`);
        return defaultContacts;
      }
      const { info } = item;
      const items = info.split(' ');
      if (items.length !== 2) {
        apiCheckConsole.error(`неожиданные данные для ${path}, ожидается "<phone> <email>", получено`, info);
        return defaultContacts;
      }
      const [phone, email] = items;
      if (phone.length !== 11 || phone.slice(0, 1) !== '8') {
        apiCheckConsole.error(`${path}, телефон должен быть в формате 88007003942, получен`, phone, phone.length, phone.slice(0, 1));
        return defaultContacts;
      }
      if (!checkEmail(email)) {
        apiCheckConsole.error(`${email} имеет не корректный формат email`);
        return defaultContacts;
      }
      return { phone: `+7${phone.slice(1)}`, email };
    }).then(resolve).catch(() => { apiCheckConsole.error(`can't get ${path}`); resolve(defaultContacts); });
  });
}

function me(deep) {
  const location = 'user';
  return new Promise((resolve, reject) => get(location).then((data) => {
    const user = transformUser(data, new Profile());

    return user;
  }).then(resolve).catch((err) => {
    apiCheckConsole.warn(err);

    if (err.response && err.response.status >= 500 && deep < 10) {
      const newDeep = deep ? 1 : deep + 1;
      message(`Произошла ошибка при подготовке ответа сервером. Повторяем попытку (${newDeep} из 10)`);
      me(newDeep).then(resolve).catch(reject);
    } else {
      reject(err);
    }
  }));
}

export { login, me, contacts };
