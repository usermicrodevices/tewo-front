import { get } from 'utils/request';
import checkData from 'utils/dataCheck';

const getLocations = () => Promise.all([
  get('/refs/countries/'),
  get('/refs/regions/'),
  get('/refs/cities/'),
]).then((locations) => {
  const [countriesData, regionsData, citiesData] = locations;
  for (const country of countriesData) {
    checkData(country, {
      name: 'string',
      currency: 'string',
      id: 'number',
    });
  }
  for (const region of regionsData) {
    checkData(region, {
      name: 'string',
      country: 'number',
      id: 'number',
    });
  }
  for (const city of citiesData) {
    checkData(city, {
      name: 'string',
      region: 'number',
      id: 'number',
    });
  }

  const [countries, regions, cities] = locations.map((itm) => new Map(itm.map((data) => [data.id, data])));
  return { countries, regions, cities };
});

export default getLocations;
