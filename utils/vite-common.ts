import {defineConfig} from 'vite';
import {nxViteTsPaths} from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

const viteCommon = defineConfig({
  plugins: [nxViteTsPaths()]
});

export {
  viteCommon
};
