import React from 'react';
import { Redirect, useParams } from 'react-router-dom';
import { inject, observer } from 'mobx-react';

import CompaniesComponent from 'components/companies';
import Editor from 'elements/editor';
import Card from 'elements/card';
import Loader from 'elements/loader';

const Companies = ({ session }) => {
  const { companiesModel } = session;
  const { id } = useParams();
  if (typeof id !== 'undefined') {
    const idNum = parseInt(id, 10);
    const elementForEdit = companiesModel.rawData.find(({ id: itmId }) => idNum === itmId);
    if (elementForEdit) {
      return <Card><Editor data={elementForEdit} /></Card>;
    }
    return <Card><Loader size="huge" /></Card>;
  }
  if (companiesModel.rawData.length === 1) {
    const [company] = companiesModel.rawData;
    return <Redirect to={`companies/${company.id}`} />;
  }
  return <CompaniesComponent />;
};

export default inject('session')(observer(Companies));
