import React from 'react';

import Typography from 'elements/typography';

function MapHeader({ title }) {
  return <Typography.Title level={1} style={{ marginBottom: 24 }}>{title}</Typography.Title>;
}

export default MapHeader;
