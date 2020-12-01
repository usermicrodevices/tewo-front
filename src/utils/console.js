import { isShowAPICheckErrors } from 'config';

let isAPIErrorsDetected = false;

const apiCheckConsole = isShowAPICheckErrors ? console : {
  ...console,
  error: () => {
    if (!isAPIErrorsDetected) {
      isAPIErrorsDetected = true;
      console.error('Были обнаружены ошибки при проверке ответа API');
    }
  },
};

export default apiCheckConsole;
