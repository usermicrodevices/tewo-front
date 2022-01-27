import { get, post } from 'utils/request';
import checkData from 'utils/dataCheck';
import { message } from 'antd';

const getTags = () => get('/refs/tags/').then((json) => {
  if (!Array.isArray(json)) {
    return [];
  }
  for (const element of json) {
    checkData(element, {
      id: 'number',
      name: 'string',
      weight: 'number',
      group: 'number',
    });
  }
  return json;
});

const addTag = (data) => post('/refs/tags/', data)
  .then((response) => {
    message.success('Тег успешно добавлен!');
    return response;
  })
  .catch((reason) => {
    const { response } = reason;
    if (response.status === 403) {
      message.error(response.data.detail);
    } else if (Array.isArray(response.data.non_field_errors)) {
      message.error(response.data.non_field_errors.join(', '));
    } else {
      message.error('Произошла ошибка при создании тега');
    }
    throw reason;
  });

export { getTags, addTag };
