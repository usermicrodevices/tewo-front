import React from 'react';

import GenericTablePage from 'pages/genericTablePage';
import CompaniesComponent from 'components/companies';

const Companies = () => <GenericTablePage storageName="companiesModel"><CompaniesComponent /></GenericTablePage>;

export default Companies;
