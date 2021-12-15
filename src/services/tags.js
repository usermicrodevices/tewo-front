import { get, post } from 'utils/request';
import checkData from 'utils/dataCheck';

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

const addTag = (data) => post('/refs/tags/', data);

export { getTags, addTag };
