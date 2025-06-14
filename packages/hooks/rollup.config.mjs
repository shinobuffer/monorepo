import { defineConfig } from 'rollup';
import { swc } from 'rollup-plugin-swc3';
import { dts } from "rollup-plugin-dts";

export default defineConfig([
  {
    input: './src/index.ts',
    output: [
      {
        dir: 'cjs',
        format: 'cjs',
        preserveModules: true,
        sourcemap: true,
      },
      {
        dir: 'esm',
        format: 'esm',
        preserveModules: true,
        sourcemap: true,
      },
    ],
    external: ['react'],
    plugins: [swc()],
  },
  {
		input: './src/index.ts',
		plugins: [dts()],
		output: [{ dir: 'lib', preserveModules: true }],
	},
])
