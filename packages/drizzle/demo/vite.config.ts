import type {ConfigEnv, UserConfig} from 'vite';
import {defineConfig, loadEnv, mergeConfig} from 'vite';
import {viteCommon} from '../../../utils/vite-common';
import {DEV_SERVER_PORT} from './shared';

export default defineConfig((env: ConfigEnv): UserConfig => {
  process.env = {...process.env, ...loadEnv(env.mode, process.cwd())};

  return mergeConfig(
      viteCommon,
      ({
        server: {
          host: true,
          port: DEV_SERVER_PORT
        }
      } satisfies UserConfig)
  );
});
