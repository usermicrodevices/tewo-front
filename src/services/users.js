/* eslint-disable no-param-reassign */
import { get, patch, post } from 'utils/request';
import checkData from 'utils/dataCheck';

import User from 'models/user';

const ROLES_LOCATION = '/refs/roles/';
const USERS_LOCATION = '/refs/users/';

/**
 *
 * @param {*} data
 * @param {User} user
 */
export const transformUser = (data, user) => {
  const shouldBe = {
    id: 'number',
    date_joined: 'date',
    domain: 'string',
    email: 'string',
    first_name: 'string',
    groups: 'array',
    is_active: 'boolean',
    last_login: 'date',
    last_name: 'string',
    role: 'any',
    username: 'string',
    sale_points: 'array',
    companies: 'array',
  };
  const mayBe = {
    contract_finished: 'date',
    avatar: 'string',
    user_permissions: 'any',
    is_staff: 'any',
    is_superuser: 'any',
  };

  if (!checkData(data, shouldBe, mayBe)) {
    console.error('обнаружены ошибки при обработке эндпоинта полей пользователя');
  }

  const rename = {
    id: 'id',
    email: 'email',
    username: 'username',
    first_name: 'firstName',
    last_name: 'lastName',
    is_active: 'isActive',
    role: 'roleId',
    user_permissions: 'permissions',
    sale_points: 'salePoints',
    companies: 'companies',
    avatar: 'avatar',
    contract_finished: 'contractFinished',
    last_login: 'lastLogin',
  };

  for (const [jsonName, objectName] of Object.entries(rename)) {
    if (jsonName in shouldBe || jsonName in mayBe) {
      user[objectName] = data[jsonName];
    } else {
      console.error(`Попытка извлечь непроверенные данные пользователя ${jsonName}`, shouldBe);
    }
  }

  return user;
};

export function getRoles(map) {
  return get(ROLES_LOCATION).then((data) => {
    if (Array.isArray(data)) {
      for (const datum of data) {
        if (!checkData(datum, {
          id: 'number',
          value: 'string',
          description: 'string',
        }, { mobile: 'string', group: 'number' })) {
          console.error(`Неожиданные данные для ролей ${ROLES_LOCATION}`, datum);
        }

        map.set(datum.id, datum.description);
      }
    }
    return map;
  });
}

export function createGetUsers(session) {
  return () => new Promise((resolve, reject) => {
    get(USERS_LOCATION).then((users) => {
      if (!Array.isArray(users)) {
        console.error(`${USERS_LOCATION} ожидаеся в ответ массив, получен ${typeof users}`, users);
      }

      resolve({
        count: users.length,
        results: users.map((data) => transformUser(data, new User(session))),
      });
    }).catch(reject);
  });
}

export function applyUser() {

}
