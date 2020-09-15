import React from 'react';
import TimeAgo from 'react-timeago';
import rusStrings from 'react-timeago/lib/language-strings/ru';
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';
import moment from 'moment';

const formatter = buildFormatter(rusStrings);

const OBSOLETE = 10 * 60 * 1000;

const timeAgo = ({ date }) => {
  const now = moment();
  if (OBSOLETE < now - date) {
    return date.format('D MMMM HH:mm');
  }
  return <TimeAgo date={date} formatter={formatter} />;
};

export default timeAgo;
