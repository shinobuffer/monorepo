// @ts-check
import { defineConfig } from 'rollup';
import { swc } from 'rollup-plugin-swc3';
import { dts } from 'rollup-plugin-dts';
import nodeResolve from '@rollup/plugin-node-resolve';

export default defineConfig([
  {
    input: './src/index.ts',
    output: [
      {
        dir: 'cjs',
        format: 'cjs',
        preserveModules: true,
        preserveModulesRoot: 'src',
        sourcemap: true,
        interop: 'auto',
      },
      {
        dir: 'esm',
        format: 'esm',
        preserveModules: true,
        preserveModulesRoot: 'src',
        sourcemap: true,
      },
    ],
    external: ['react'],
    plugins: [nodeResolve(), swc({ sourceMaps: true })],
  },
  {
    input: './src/index.ts',
    plugins: [dts()],
    output: [{ dir: 'lib', preserveModules: true }],
  },
]);
