/* eslint-disable no-param-reassign */
import {
  get, patch, post, del,
} from 'utils/request';
import checkData from 'utils/dataCheck';
import apiCheckConsole from 'utils/console';

import User from 'models/user';

const ROLES_LOCATION = '/refs/roles/';
const USERS_LOCATION = '/refs/users/';

const FIELDS_ALIASES = {
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
    last_name: 'string',
    role: 'any',
    username: 'string',
    sale_points: 'array',
    companies: 'array',
  };
  const mayBe = {
    last_login: 'date',
    contract_finished: 'date',
    avatar: 'string',
    user_permissions: 'any',
    is_staff: 'any',
    is_superuser: 'any',
  };

  if (!checkData(data, shouldBe, mayBe)) {
    apiCheckConsole.error('обнаружены ошибки при обработке эндпоинта полей пользователя');
  }

  for (const [jsonName, objectName] of Object.entries(FIELDS_ALIASES)) {
    if (jsonName in shouldBe || jsonName in mayBe) {
      user[objectName] = data[jsonName];
    } else {
      apiCheckConsole.error(`Попытка извлечь непроверенные данные пользователя ${jsonName}`, shouldBe);
    }
  }

  return user;
};

const form = (data) => {
  const json = {};
  const renamer = new Map(Object.entries(FIELDS_ALIASES).map(([a, b]) => [b, a]));

  const getKey = (key, getter) => getter.get(key) || key;

  for (const [key, value] of Object.entries(data)) {
    json[getKey(key, renamer)] = value;
  }

  return json;
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
          apiCheckConsole.error(`Неожиданные данные для ролей ${ROLES_LOCATION}`, datum);
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
        apiCheckConsole.error(`${USERS_LOCATION} ожидаеся в ответ массив, получен ${typeof users}`, users);
      }

      resolve({
        count: users.length,
        results: users.map((data) => transformUser(data, new User(session))),
      });
    }).catch(reject);
  });
}

export async function applyUser(id, changes, session) {
  const data = form(changes);

  const request = id === null ? post(USERS_LOCATION, data) : patch(`${USERS_LOCATION}${id}/`, data);

  const response = await request;

  return transformUser(response, new User(session));
}

export async function deleteUser(id) {
  return del(`${USERS_LOCATION}${id}`);
}
