import { get } from 'utils/request';
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
      count: salePoints.length,
      results: salePoints.map((data) => {
        const stouldBe = {
          id: 'number',
          name: 'string',
          company: 'number',
          created_date: 'date',
        };
        const mayBe = {
          emails: 'array',
          person: 'string',
          phone: 'string',
          address: 'string',
          city: 'number',
          map_point: 'location',
        };
        checkData(data, stouldBe, mayBe);

        const point = new SalePoint();

        for (const [jsonName, objectName] of Object.entries({
          id: 'id',
          name: 'name',
          address: 'address',
          created_date: 'createdDate',
          map_point: 'mapPoint',
          company: 'companyId',
        })) {
          if (jsonName in stouldBe) {
            point[objectName] = data[jsonName];
          } else if (jsonName in mayBe) {
            if (jsonName in data) {
              point[objectName] = data[jsonName];
            } else {
              point[objectName] = null;
            }
          } else {
            if (jsonName in data) {
              point[objectName] = data[jsonName];
            } else {
              console.error('не обнаружены ожидаемые данные в объекте, UB далее при использовании SalePpoints');
            }
            console.error(`Попытка извлечь непроверенные данные ${jsonName}`, stouldBe);
          }
        }
        point.session = session;
        return point;
      }),
    });
  }).catch(reject);
});

export default getSalePoints;
