import { get } from 'utils/request';
import moment from 'moment';
import SalePoint from 'models/salePoints/salePoint';
import checkData from 'utils/dataCheck';

const getSalePoints = (session) => () => new Promise((resolve, reject) => {
  get('/refs/sale_points/').then((salePoints) => {
    if (!Array.isArray(salePoints)) {
      console.error(`/refs/sale_points ожидаеся в ответ массив, получен ${typeof salePoints}`, salePoints);
      reject(salePoints);
      return;
    }

    resolve({
      count: 1, // salePoints.length,
      results: salePoints.map((data) => {
        const stouldBe = {
          id: 'number',
          name: 'string',
          company: 'number',
          created_date: 'date',
        };
        const mayBe = {
          emails: 'string',
          person: 'string',
          phone: 'string',
          address: 'string',
          city: 'number',
          map_point: 'location',
        };
        checkData(data, stouldBe, mayBe);

        const point = new SalePoint(session);

        for (const [jsonName, objectName] of Object.entries({
          id: 'id',
          name: 'name',
          company: 'companyId',
          address: 'address',
          created_date: 'createdDate',
          map_point: 'mapPoint',
          city: 'cityId',
          person: 'person',
          phone: 'phone',
          emails: 'email',
        })) {
          point[objectName] = jsonName === 'created_date' ? moment(data[jsonName]) : data[jsonName];
        }
        return point;
      }).slice(0, 1),
    });
  }).catch(reject);
});

export default getSalePoints;
