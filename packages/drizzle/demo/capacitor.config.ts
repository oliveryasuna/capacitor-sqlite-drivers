import type {CapacitorConfig} from '@capacitor/cli';
import process from 'process';
import {DEV_SERVER_ADDRESS, DEV_SERVER_PORT, WEB_DIR} from './shared';
import type {ReadonlyDeep} from 'type-fest';
import deepmerge from 'deepmerge';

const CONFIG_BASE: ReadonlyDeep<CapacitorConfig> = {
  appId: 'com.oliveryasuna.capacitor_sqlite_drivers.drizzle',
  appName: 'Drizzle Demo',
  webDir: WEB_DIR,
  loggingBehavior: 'production',
  server: {
    androidScheme: 'http',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: false
    },
    CapacitorSQLite: {
      iosDatabaseLocation: 'Library/CapacitorDatabase',
      iosIsEncryption: true,
      iosKeychainPrefix: 'drizzle',
      iosBiometric: {
        biometricAuth: false,
        biometricTitle: ''
      },
      androidIsEncryption: true,
      androidBiometric: {
        biometricAuth: false,
        biometricTitle: '',
        biometricSubTitle: ''
      }
    }
  }
};

let config: ReadonlyDeep<CapacitorConfig> = CONFIG_BASE;

if(process.env['MODE'] === 'development') {
  const devServerUrl: string = `http://${DEV_SERVER_ADDRESS}:${DEV_SERVER_PORT.toString()}`;

  config = deepmerge(
      config,
      {
        server: {
          allowNavigation: [devServerUrl],
          url: devServerUrl
        },
        android: {
          allowMixedContent: true
        }
      }
  );
}

console.log(config);

export default config;
