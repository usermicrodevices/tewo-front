import React from 'react';
import { Redirect, useParams } from 'react-router-dom';
import { inject, observer } from 'mobx-react';

import SaleModelComponent from 'components/salePoints';
import Editor from 'elements/editor';
import Card from 'elements/card';
import Loader from 'elements/loader';

const Companies = ({ session }) => {
  const { pointsModel } = session;
  const { id } = useParams();
  if (typeof id !== 'undefined') {
    const idNum = parseInt(id, 10);
    const elementForEdit = pointsModel.rawData.find(({ id: itmId }) => idNum === itmId);
    if (elementForEdit) {
      return <Card><Editor data={elementForEdit} /></Card>;
    }
    return <Card><Loader size="huge" /></Card>;
  }
  if (pointsModel.rawData.length === 1) {
    const [company] = pointsModel.rawData;
    return <Redirect to={`sale_points/${company.id}`} />;
  }
  return <SaleModelComponent />;
};

export default inject('session')(observer(Companies));
