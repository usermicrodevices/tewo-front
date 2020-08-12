import { post, get } from 'utils/request';
import checkData from 'utils/dataCheck';
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

function me() {
  return new Promise((resolve, reject) => {
    get('user').then((data) => {
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
      if (!checkData(data, shouldBe, {}, {
        username: (name) => name.length > 0,
      })) {
        reject(new Error('type error'));
      }

      const user = new User();

      for (const [jsonName, objectName] of Object.entries({
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
      })) {
        if (jsonName in shouldBe) {
          user[objectName] = data[jsonName];
        } else {
          console.error(`Попытка извлечь непроверенные данные ${jsonName}`, shouldBe);
          reject(new Error('developing consistency error'));
        }
      }
      // @todo check is all fields defined
      resolve(user);
    }).catch(reject);
  });
}

export { login, me };
