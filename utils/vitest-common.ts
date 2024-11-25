import {defineConfig, mergeConfig} from 'vitest/config';
import path from 'node:path';
import {viteCommon} from './vite-common';

const vitestCommon = mergeConfig(
    viteCommon,
    defineConfig({
      test: {
        globals: true
      },
      cacheDir: path.resolve(__dirname, '../../node_modules/.vitest')
    })
);

export {
  vitestCommon
};
