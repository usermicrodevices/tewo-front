import React from 'react';
import TimeAgo from 'react-timeago';
import rusStrings from 'react-timeago/lib/language-strings/ru';
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';

const formatter = buildFormatter(rusStrings);

const timeAgo = ({ date }) => <TimeAgo date={date} formatter={formatter} />;

export default timeAgo;
