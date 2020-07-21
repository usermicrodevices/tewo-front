import { post, get } from 'utils/request';
import checkData from 'utils/dataCheck';
import User from 'models/user';

function login(data) {
  return new Promise((resolve, reject) => {
    post('login', data).then((response) => {
      if (Object.keys(response.data).length !== 1 || typeof response.data.token !== 'string') {
        reject(new Error(response));
      }
      resolve(response.data.token);
    }).catch(reject);
  });
}

function me() {
  return new Promise((resolve, reject) => {
    get('user').then(({ data }) => {
      const stouldBe = {
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
      };
      if (!checkData(data, stouldBe)) {
        reject(new Error('type error'));
      }

      const user = new User();

      for (const [jsonName, objectName] of Object.entries({
        id: 'id',
        email: 'email',
        username: 'string',
        first_name: 'firstName',
        last_name: 'lastName',
        is_active: 'isActive',
        is_staff: 'isStaff',
        is_superuser: 'isSuperuser',
        user_permissions: 'permissions',
      })) {
        if (jsonName in stouldBe) {
          user[objectName] = data[jsonName];
        } else {
          console.error(`Плпытка извлечь непроверенные данные ${jsonName}`, stouldBe);
          reject(new Error('developing consistency error'));
        }
      }
      // @todo check is all field defined
      resolve(user);
    }).catch(reject);
  });
}

export { login, me };
