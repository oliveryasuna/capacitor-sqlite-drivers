import type {ConfigEnv} from 'vitest/config';
import {defineConfig, mergeConfig} from 'vitest/config';
import {vitestCommon} from '../../utils/vitest-common';
import type {UserConfig} from 'vite';
import swc from 'unplugin-swc';

export default defineConfig((_env: ConfigEnv): UserConfig =>
    mergeConfig(
        vitestCommon,
        ({
          plugins: [
            swc.vite({
              module: {
                type: 'es6'
              }
            })
          ]
        } satisfies UserConfig)
    ));
