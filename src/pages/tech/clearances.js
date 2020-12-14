import React from 'react';
import { Card as AntdCard } from 'antd';
import { inject, Provider, observer } from 'mobx-react';

import ClearancesModel from 'models/events/clearances';
import { TableHeader } from 'elements/headers';
import Table from 'elements/table';
import Card from 'elements/card';
import GenericCalendar from 'elements/calendar';
import colors from 'themes/calendar';
import Badge from 'elements/badged';
import Format from 'elements/format';
import Typography from 'elements/typography';
import SummaryCard from 'elements/card/summary';

import classes from './clearances.module.scss';

const Calendar = inject('table')(observer(({ table }) => {
  const { calendar } = table;
  const onSelect = (date) => {
    calendar.setDateFilter([date.clone().startOf('day'), date.clone().endOf('day')]);
  };
  const onPanelChange = (moment) => {
    calendar.setMonth(moment);
  };
  return (
    <AntdCard>
      <div className={classes.legend}>
        <Badge size={11} align="right" stateColor={colors.beverages}>Наливы</Badge>
        <Badge size={11} align="right" stateColor={colors.clearance}>Очистки</Badge>
      </div>
      <GenericCalendar
        onSelect={onSelect}
        clearances={calendar.clearance}
        beverages={calendar.beverages}
        onPanelChange={onPanelChange}
        isLoading={calendar.isLoading}
      />
    </AntdCard>
  );
}));

const Stats = inject('table')(observer(({ table }) => {
  let { detergent } = table.stats;
  const { tablets } = table.stats;
  let ext = 'мл';
  if (detergent > 1e5) {
    ext = 'л';
    detergent /= 1e3;
  }
  return (
    <SummaryCard align="middle">
      <div>
        <Typography.Value size="xxl"><Format>{ table.isLoaded ? table.data.length : undefined }</Format></Typography.Value>
        <Typography.Caption>очисток за период</Typography.Caption>
      </div>
      <div>
        <Typography.Value size="xxl"><Format>{ tablets }</Format></Typography.Value>
        <Typography.Caption>потрачено таблеток</Typography.Caption>
      </div>
      <div>
        <div>
          <Typography.Value size="xxl">
            <Format>{ detergent }</Format>
            {' '}
            { typeof detergent === 'number' && ext }
          </Typography.Value>
        </div>
        <Typography.Caption>потрачено жидкости</Typography.Caption>
      </div>
    </SummaryCard>
  );
}));

@inject('session')
@observer
class Clearances extends React.Component {
  state = { model: null };

  componentDidMount() {
    const { session } = this.props;
    this.setState({
      model: new ClearancesModel(session),
    });
  }

  render() {
    const { model } = this.state;
    if (model === null) {
      return null;
    }
    return (
      <Provider table={model} filter={model.filter}>
        <TableHeader title="История очисток" />
        <div className={classes.grid}>
          <Calendar />
          <Stats />
          <Card className={classes.table}>
            <Table />
          </Card>
        </div>
      </Provider>
    );
  }
}

export default Clearances;
