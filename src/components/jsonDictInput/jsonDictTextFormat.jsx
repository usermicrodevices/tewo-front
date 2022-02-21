import React from 'react';

const JsonDictTextFormat = ({ json }) => (
  <div>
    {Object.keys(json).sort().map((key) => (
      <div>
        <b>
          {key}
        </b>
        {'  '}
        {json[key] || '-'}
      </div>
    ))}
  </div>
);

export default JsonDictTextFormat;
