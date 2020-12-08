import React from 'react';
import { inject, observer } from 'mobx-react';

import SummaryCard from 'elements/card/summary';

const Summary = ({ table }) => {
  return (
    <SummaryCard>
      Сводная информация
    </SummaryCard>
  );
};

export default inject('table')(observer(Summary));
