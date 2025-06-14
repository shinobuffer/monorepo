// @ts-check
import { defineConfig } from 'rollup';
import json from '@rollup/plugin-json';
import { swc } from 'rollup-plugin-swc3';
import { dts } from 'rollup-plugin-dts';
import nodeResolve from '@rollup/plugin-node-resolve';

const entryFileNamesWithExt = (ext) => {
  return ({ name }) => {
    const keyword = 'node_modules';
    if (!name?.includes(keyword)) {
      return `[name].${ext}`;
    }
    const firstIndex = name.indexOf(keyword);
    const lastIndex = name.lastIndexOf(keyword);
    return `${name.slice(0, firstIndex)}3rd${name.slice(lastIndex + keyword.length)}.${ext}`;
  };
};

export default defineConfig([
  {
    input: './src/index.ts',
    output: [
      {
        dir: 'cjs',
        format: 'cjs',
        entryFileNames: entryFileNamesWithExt('cjs'),
        preserveModules: true,
        preserveModulesRoot: 'src',
        sourcemap: true,
        interop: 'auto',
      },
      {
        dir: 'esm',
        format: 'esm',
        entryFileNames: entryFileNamesWithExt('mjs'),
        preserveModules: true,
        preserveModulesRoot: 'src',
        sourcemap: true,
      },
    ],
    external: ['react'],
    plugins: [nodeResolve(), json(), swc({ sourceMaps: true })],
  },
  {
    input: './src/index.ts',
    plugins: [dts()],
    output: [{ dir: 'lib', preserveModules: true }],
  },
]);
