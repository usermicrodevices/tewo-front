import tableWidget from '../tableWidget';

const localeComparator = (field) => (a, b) => {
  if (typeof a[field] === 'string' && typeof b[field] === 'string') {
    return a[field].localeCompare(b[field]) || a.key - b.key;
  }
  return a.key - b.key;
};

const FavoriteObjects = tableWidget([
  {
    title: 'Объект',
    dataIndex: 'salePointName',
    sorter: localeComparator('salePointName'),
  },
  {
    title: 'Оборудование',
    dataIndex: 'name',
    sorter: localeComparator('name'),
  },
  {
    title: 'Наливов перед выключением',
    dataIndex: 'beverages',
    sorter: (a, b) => a.beverages - b.beverages || a.key - b.key,
    sortOrder: 'descend',
  },
]);

export default FavoriteObjects;
