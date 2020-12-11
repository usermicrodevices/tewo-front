import React from 'react';
import { inject, observer } from 'mobx-react';

import Format from 'elements/format';
import Typography from 'elements/typography';
import ChangesLabel from 'elements/changesLabel';
import SummaryCard from 'elements/card/summary';

const Stats = ({ table: { wholeSales: { cur, prw } } }) => (
  <SummaryCard>
    <div>
      <Typography.Value size="xl"><Format isCost>{ cur }</Format></Typography.Value>
      <Typography.Caption>сумма продаж за текущий период</Typography.Caption>
    </div>
    { cur !== prw && (
      <div>
        <ChangesLabel typographySize="xl" value={(cur - prw) / prw * 100} />
        <Typography.Caption>динамика наливов</Typography.Caption>
      </div>
    )}
    <div>
      <Typography.Value size="xl"><Format isCost>{ prw }</Format></Typography.Value>
      <Typography.Caption>сумма продаж за предыдущий период</Typography.Caption>
    </div>
  </SummaryCard>
);

export default inject('table')(observer(Stats));
