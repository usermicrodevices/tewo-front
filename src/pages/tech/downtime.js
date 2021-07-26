import React, { useState } from 'react';
import { inject, Provider, observer } from 'mobx-react';
import { Card } from 'antd';
import moment from 'moment';

import OverdueModel from 'models/events/overdue';
import { TableHeader } from 'elements/headers';
import Format from 'elements/format';
import Table from 'elements/table';
import Barchart from 'elements/chart/barchart';
import Loader from 'elements/loader';
import Typography from 'elements/typography';
import DaterangeTitle from 'elements/chart/daterangeTitle';

import classes from './downtime.module.scss';

const Values = inject('table')(observer(({ table }) => (
  <div className={classes.charthead}>
    <DaterangeTitle announce="Период" range={table.filter.get('open_date')} />
    <div className={classes.values}>
      <div>
        <Typography.Value size="xl"><Format>{ table.amount }</Format></Typography.Value>
        <Typography.Caption>просроченные события</Typography.Caption>
      </div>
      <div>
        <Typography.Value size="xl">
          <Format>{ table.downtime && moment.duration(table.downtime, 'second').humanize() }</Format>
        </Typography.Value>
        <Typography.Caption>суммарное время простоя</Typography.Caption>
      </div>
    </div>
  </div>
)));

const Chart = inject('table')(observer(({ table }) => {
  const [selected, onSelect] = useState();
  if (typeof table.pointsDowntimes === 'undefined') {
    return <Loader />;
  }
  const MAX_POINTS = 60;
  return (
    <Barchart
      height={345}
      onSelect={onSelect}
      selected={selected}
      x={table.pointsDowntimes.map(({ name }) => name).slice(0, MAX_POINTS)}
      y={table.pointsDowntimes.map(({ downtime }) => Math.round(downtime / 60)).slice(0, MAX_POINTS)}
      yAxis="Время простоя (минут)"
    />
  );
}));

@inject('session')
@observer
class Downtime extends React.Component {
  state = { model: null };

  componentDidMount() {
    const { session } = this.props;
    this.setState({
      model: new OverdueModel(session),
    });
  }

  render() {
    const { model } = this.state;
    if (model === null) {
      return null;
    }
    return (
      <Provider table={model} filter={model.filter}>
        <TableHeader title="Время простоя оборудования" />
        <Card className={classes.chart}>
          <Values />
          <Chart />
        </Card>
        <Card className={classes.table}>
          <Typography.Title level={3}>Время отклика на событие</Typography.Title>
          <Table />
        </Card>
      </Provider>
    );
  }
}

export default Downtime;
