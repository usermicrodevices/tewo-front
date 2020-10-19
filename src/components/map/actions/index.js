import React from 'react';

import classnames from './index.module.scss';

function ActionsContainer({ position = 'topRight', children }) {
  const defaultStyle = {
    display: 'flex', flexDirection: 'column', position: 'absolute', zIndex: 1,
  };

  const positionStyles = {
    topLeft: { left: '20px', bottom: '20px' },
    topRight: { right: '20px', top: '20px' },
    bottomLeft: { left: '20px', bottom: '40px' },
    bottomRight: { right: '20px', bottom: '40px' },
  };

  return (
    <div style={{ ...defaultStyle, ...positionStyles[position] }}>
      {children}
    </div>
  );
}

ActionsContainer.Group = function ActionsGroup({ children }) {
  return (
    <div className={classnames.group}>
      {children}
    </div>
  );
};

export default ActionsContainer;
