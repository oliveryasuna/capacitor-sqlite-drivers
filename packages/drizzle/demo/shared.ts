import path from 'path';
import ip from 'ip';

const WEB_DIR: string = path.resolve(__dirname, 'dist');

const DEV_SERVER_ADDRESS: string = ip.address();
const DEV_SERVER_PORT: number = 3000;

export {
  WEB_DIR,
  DEV_SERVER_ADDRESS,
  DEV_SERVER_PORT
};
