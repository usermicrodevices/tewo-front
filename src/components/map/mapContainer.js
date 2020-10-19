import React from 'react';

function MapContainer({ isFullscreen = false, children }) {
  const containerStyles = isFullscreen ? {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, borderRadius: '8px', overflow: 'hidden',
  } : {
    position: 'relative', width: '100%', height: '100%', flex: 1, borderRadius: '8px', overflow: 'hidden',
  };

  return (
    <div style={containerStyles}>
      {children}
    </div>
  );
}

export default MapContainer;
