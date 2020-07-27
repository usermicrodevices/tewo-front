import Company from 'models/companies/company';

function generateRandomCompany(_, id) {
  const c = new Company();

  c.id = id;

  const names = ['Вектор', 'Vector', 'Тензор', 'Функтур', 'Кофемашины в аренду', 'Природно-оздоровительный комплекс "Кофейная жаровня в петрозаводске"'];
  c.name = names[Math.floor(Math.random() * names.length)];

  const locations = ['Moscow', 'Москва', 'Вена', 'Верона', 'Воронеж', 'Воркута', 'Венеция'];
  c.location = locations[Math.floor(Math.random() * locations.length)];

  c.objectsCount = Math.floor(Math.random() * 1e3);

  c.actions = null;

  c.inn = null;

  c.account = null;

  return c;
}

function getCompanies() {
  return new Promise((resolve, reject) => {
    const randomCompanies = new Array(10000).fill(null).map(generateRandomCompany);
    setTimeout(() => { resolve(randomCompanies); }, 1500);
  });
}

export default getCompanies;
