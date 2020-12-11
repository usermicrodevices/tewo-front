export const MOBILE = 'device:mobile';
export const TABLET = 'device:tablet';
export const DESKTOP = 'device:desktop';

export function getDeviceType() {
  const width = window.innerWidth;

  if (width < 480) {
    return MOBILE;
  } if (width < 1024) {
    return TABLET;
  }

  return DESKTOP;
}

export function isMobile() {
  return getDeviceType() === MOBILE;
}
