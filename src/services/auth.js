import { post, get } from 'utils/request';
import checkData, { checkEmail } from 'utils/dataCheck';
import User from 'models/user';

function login(data) {
  return new Promise((resolve, reject) => {
    post('login', data).then((response) => {
      if (Object.keys(response).length !== 1 || typeof response.token !== 'string') {
        reject(new Error(response));
      }
      resolve(response.token);
    }).catch(reject);
  });
}

function contacts() {
  const path = '/tech/contacts/';
  const defaultContacts = { phone: '+78007003942', email: 'support@service-pb.ru' };
  return new Promise((resolve) => {
    get(path).then((data) => {
      if (!Array.isArray(data)) {
        console.error(`${path} ожидается массив, получен ${typeof data}`);
        return defaultContacts;
      }

      const item = data.sort(({ id: idA }, { id: idB }) => Math.sign(idB - idA))[0];
      if (!checkData(item, {
        id: 'number',
        info: 'string',
      })) {
        console.error(`${path} получил некорректные данные`);
        return defaultContacts;
      }
      const { info } = item;
      const items = info.split(' ');
      if (items.length !== 2) {
        console.error(`неожиданные данные для ${path}, ожидается "<phone> <email>", получено`, info);
        return defaultContacts;
      }
      const [phone, email] = items;
      if (phone.length !== 11 || phone.slice(0, 1) !== '8') {
        console.error(`${path}, телефон должен быть в формате 88007003942, получен`, phone, phone.length, phone.slice(0, 1));
        return defaultContacts;
      }
      if (!checkEmail(email)) {
        console.error(`${email} имеет не корректный формат email`);
        return defaultContacts;
      }
      return { phone: `+7${phone.slice(1)}`, email };
    }).then(resolve).catch(() => { console.error(`can't get ${path}`); resolve(defaultContacts); });
  });
}

function me() {
  const location = 'user';
  return get(location).then((data) => {
    const shouldBe = {
      id: 'number',
      date_joined: 'date',
      domain: 'string',
      email: 'string',
      first_name: 'string',
      groups: 'array',
      is_active: 'boolean',
      is_staff: 'boolean',
      is_superuser: 'boolean',
      last_login: 'date',
      last_name: 'string',
      password: 'string',
      role: 'any',
      username: 'string',
      user_permissions: 'array',
      sale_points: 'array',
      companies: 'array',
    };
    if (!checkData(data, shouldBe, { contract_finished: 'date' }, {
      username: (name) => name.length > 0,
    })) {
      console.error(`обнаружены ошибки при обработке эндпоинта ${location}`);
    }

    const user = new User();

    const rename = {
      id: 'id',
      email: 'email',
      username: 'username',
      first_name: 'firstName',
      last_name: 'lastName',
      is_active: 'isActive',
      is_staff: 'isStaff',
      is_superuser: 'isSuperuser',
      user_permissions: 'permissions',
      sale_points: 'salePoints',
      companies: 'companies',
    };

    for (const [jsonName, objectName] of Object.entries(rename)) {
      if (jsonName in shouldBe) {
        user[objectName] = data[jsonName];
      } else {
        console.error(`Попытка извлечь непроверенные данные пользователя ${jsonName}`, shouldBe);
      }
    }
    return user;
  });
}

export { login, me, contacts };
